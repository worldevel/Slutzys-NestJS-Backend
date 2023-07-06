import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { EarningService } from 'src/modules/earning/services/earning.service';
export declare class UpdatePayoutRequestListener {
    private readonly queueEventService;
    private readonly mailService;
    private readonly performerService;
    private readonly earningService;
    constructor(queueEventService: QueueEventService, mailService: MailerService, performerService: PerformerService, earningService: EarningService);
    handler(event: QueueEvent): Promise<void>;
    private handlePerformer;
}
