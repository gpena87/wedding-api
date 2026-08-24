"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
const rxjs_1 = require("rxjs");
let EmailService = EmailService_1 = class EmailService {
    configService;
    resend;
    logger = new common_1.Logger(EmailService_1.name);
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.getOrThrow('RESEND_API_KEY');
        this.resend = new resend_1.Resend(apiKey);
    }
    sendNotification(user) {
        const email = this.configService.getOrThrow('EMAIL_SEND');
        return (0, rxjs_1.from)((async () => {
            try {
                const htmlContent = this.generateEmailHTML(user);
                const from = this.configService.getOrThrow('EMAIL_FROM');
                const { error } = await this.resend.emails.send({
                    from,
                    to: email,
                    subject: 'Confirmacion',
                    html: htmlContent,
                });
                if (error) {
                    throw new Error(error.message);
                }
                this.logger.log(`Email de actualización enviado a ${email}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                this.logger.error(`Error al enviar email a ${email}: ${errorMessage}`);
                throw error;
            }
        })());
    }
    generateEmailHTML(user) {
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
    sendNotificationConfirmation(user) {
        const email = user.email;
        if (!email) {
            return (0, rxjs_1.from)(Promise.reject(new Error('El usuario no tiene email')));
        }
        return (0, rxjs_1.from)((async () => {
            try {
                const htmlContent = this.generateEmailconfirmationHTML(user);
                const from = this.configService.getOrThrow('EMAIL_FROM');
                const { error } = await this.resend.emails.send({
                    from,
                    to: email,
                    subject: 'Confirmacion',
                    html: htmlContent,
                });
                if (error) {
                    throw new Error(error.message);
                }
                this.logger.log(`Email de actualización enviado a ${email}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                this.logger.error(`Error al enviar email a ${email}: ${errorMessage}`);
                throw error;
            }
        })());
    }
    generateEmailconfirmationHTML(user) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map