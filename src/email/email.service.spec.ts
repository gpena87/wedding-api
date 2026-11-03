import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { EmailService } from "./email.service";

describe("EmailService", () => {
  let service: EmailService;
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    const configService = {
      getOrThrow: jest.fn((key: string) => {
        const values: Record<string, string> = {
          BREVO_API_KEY: "test-api-key",
          EMAIL_FROM: "sender@example.com",
          EMAIL_SEND: "admin@example.com, second@example.com",
        };
        return values[key];
      }),
      get: jest.fn((key: string) =>
        key === "EMAIL_FROM_NAME" ? "Invitaciones" : undefined,
      ),
    } as unknown as ConfigService;

    service = new EmailService(configService);
    fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 201 }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sends an invitation notification through Brevo", async () => {
    await firstValueFrom(service.sendNotification({ name: "Ana" }));

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(options?.method).toBe("POST");
    expect(options?.headers).toEqual({
      accept: "application/json",
      "api-key": "test-api-key",
      "content-type": "application/json",
    });
    expect(options?.body).toEqual(
      expect.stringContaining(
        '"to":[{"email":"admin@example.com"},{"email":"second@example.com"}]',
      ),
    );
  });

  it("sends the confirmation to the user's email", async () => {
    await firstValueFrom(
      service.sendNotificationConfirmation({
        email: "guest@example.com",
        name: "Ana",
      }),
    );

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(options?.body).toEqual(
      expect.stringContaining('"email":"guest@example.com"'),
    );
  });

  it("propagates Brevo API errors", async () => {
    fetchMock.mockResolvedValue(new Response("Unauthorized", { status: 401 }));

    await expect(
      firstValueFrom(service.sendNotification({ name: "Ana" })),
    ).rejects.toThrow("Brevo API respondió 401");
  });
});
