import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
interface EmailPayload {
    name?: string;
    lastName?: string;
    email?: string;
    numberPhone?: string;
    restriccion?: string;
    message?: string;
}
export declare class EmailService {
    private configService;
    private resend;
    private readonly logger;
    constructor(configService: ConfigService);
    sendNotification(user: EmailPayload): Observable<void>;
    private generateEmailHTML;
    sendNotificationConfirmation(user: EmailPayload): Observable<void>;
    private generateEmailconfirmationHTML;
}
export {};
