import { QueueEventService, QueueEvent } from 'src/kernel';
import { MailerService } from 'src/modules/mailer/services';
export declare class UpdatePerformerStatusListener {
    private readonly queueEventService;
    private readonly mailService;
    constructor(queueEventService: QueueEventService, mailService: MailerService);
    handleUpdateStatus(event: QueueEvent): Promise<boolean>;
}
