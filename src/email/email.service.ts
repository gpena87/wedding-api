import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable, from } from "rxjs";

interface EmailPayload {
  name?: string;
  lastName?: string;
  email?: string;
  numberPhone?: string;
  restriccion?: string;
  message?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {}

  sendNotification(user: EmailPayload): Observable<void> {
    const email = this.configService.getOrThrow<string>("EMAIL_SEND");
    return from(this.sendEmail(email, this.generateEmailHTML(user)));
  }

  private async sendEmail(email: string, htmlContent: string): Promise<void> {
    try {
      const apiKey = this.configService.getOrThrow<string>("BREVO_API_KEY");
      const senderEmail = this.configService.getOrThrow<string>("EMAIL_FROM");
      const senderName = this.configService.get<string>("EMAIL_FROM_NAME");
      const sender = senderName
        ? { email: senderEmail, name: senderName }
        : { email: senderEmail };
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender,
          to: [{ email }],
          subject: "Confirmacion",
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(
          `Brevo API respondió ${response.status}: ${errorDetails}`,
        );
      }

      this.logger.log(`Email enviado a ${email}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error al enviar email a ${email}: ${errorMessage}`);
      throw error;
    }
  }

  private generateEmailHTML(user: EmailPayload): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f3f4f6; color: #111827; }
            .card { max-width: 640px; margin: 24px 0; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); }
            .card-header { background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 24px; }
            .card-body { padding: 24px; }
            .title { font-size: 20px; font-weight: 700; margin: 0; }
            .subtitle { margin: 8px 0 0; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="card-header">
              <h2 class="title">Confirmación de Invitación</h2>
            </div>
            <div class="card-body" style="text-align: left;">
              <ul style="padding: 0; margin: 0;">
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Nombre:</strong> ${user.name || "Sin información"}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Apellido:</strong> ${user.lastName || "Sin información"}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Email:</strong> ${user.email || "Sin información"}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Teléfono:</strong> ${user.numberPhone || "Sin información"}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Restricciones:</strong> ${user.restriccion || "Sin información"}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Mensaje:</strong> ${user.message || "Sin información"}
                </li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  sendNotificationConfirmation(user: EmailPayload): Observable<void> {
    const email = user.email;
    if (!email) {
      return from(Promise.reject(new Error("El usuario no tiene email")));
    }
    return from(
      this.sendEmail(email, this.generateEmailConfirmationHTML(user)),
    );
  }

  private generateEmailConfirmationHTML(user: EmailPayload): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f3f4f6; color: #111827; }
            .card { max-width: 640px; margin: 24px 0; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); }
            .card-header { background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 24px; }
            .card-body { padding: 24px; }
            .title { font-size: 20px; font-weight: 700; margin: 0; }
            .subtitle { margin: 8px 0 0; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="card-header">
              <h2 class="title">Confirmación de Invitación</h2>
            </div>
            <div class="card-body" style="text-align: left;">
              ${user.name} Gracias por confirmar tu asistencia a nuestro evento. Estamos emocionados de contar con tu presencia y esperamos que disfrutes de la experiencia. Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
