import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Observable, from } from 'rxjs';

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
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY') ?? '';
    this.resend = new Resend(apiKey);
  }

  sendNotification(user: EmailPayload): Observable<void> {
    const email = this.configService.get<string>('EMAIL_SEND') ?? '';
    return from(
      (async () => {
        try {
          const htmlContent = this.generateEmailHTML(user);
          const from =
            this.configService.get<string>('EMAIL_FROM') ??
            'onboarding@resend.dev';
          const { error } = await this.resend.emails.send({
            from,
            to: email,
            subject: 'Confirmacion',
            html: htmlContent,
          });

          if (error) {
            this.logger.error(
              `Error al enviar email a ${email}: ${error.message}`,
            );
            return;
          }

          this.logger.log(`Email de actualización enviado a ${email}`);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          this.logger.error(
            `Error al enviar email a ${email}: ${errorMessage}`,
          );
        }
      })(),
    );
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
                  <strong>Nombre:</strong> ${user.name || 'Sin información'}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Apellido:</strong> ${user.lastName || 'Sin información'}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Email:</strong> ${user.email || 'Sin información'}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Teléfono:</strong> ${user.numberPhone || 'Sin información'}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Restricciones:</strong> ${user.restriccion || 'Sin información'}
                </li>
                <li style="margin-bottom: 10px; list-style: none; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                  <strong>Mensaje:</strong> ${user.message || 'Sin información'}
                </li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  sendNotificationConfirmation(user: EmailPayload): Observable<void> {
    const email = user.email ?? '';
    return from(
      (async () => {
        try {
          const htmlContent = this.generateEmailconfirmationHTML(user);
          const from =
            this.configService.get<string>('EMAIL_FROM') ??
            'onboarding@resend.dev';
          const { error } = await this.resend.emails.send({
            from,
            to: email,
            subject: 'Confirmacion',
            html: htmlContent,
          });

          if (error) {
            this.logger.error(
              `Error al enviar email a ${email}: ${error.message}`,
            );
            return;
          }

          this.logger.log(`Email de actualización enviado a ${email}`);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          this.logger.error(
            `Error al enviar email a ${email}: ${errorMessage}`,
          );
        }
      })(),
    );
  }

  private generateEmailconfirmationHTML(user: EmailPayload): string {
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
