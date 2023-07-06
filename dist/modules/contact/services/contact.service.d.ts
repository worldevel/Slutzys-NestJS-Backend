import { MailerService } from 'src/modules/mailer/services/mailer.service';
export declare class ContactService {
    private readonly mailService;
    constructor(mailService: MailerService);
    contact(data: any): Promise<boolean>;
}
