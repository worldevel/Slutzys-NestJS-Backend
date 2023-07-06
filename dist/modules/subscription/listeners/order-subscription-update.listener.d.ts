import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import { SubscriptionModel } from '../models/subscription.model';
import { SubscriptionDto } from '../dtos/subscription.dto';
export declare class OrderSubscriptionListener {
    private readonly performerService;
    private readonly userService;
    private readonly subscriptionModel;
    private readonly queueEventService;
    private readonly mailService;
    constructor(performerService: PerformerService, userService: UserService, subscriptionModel: Model<SubscriptionModel>, queueEventService: QueueEventService, mailService: MailerService);
    handleListenSubscription(event: QueueEvent): Promise<any>;
    private handleCCBillSubscription;
    private handleVerotelSubscription;
    handleMailerSubscription(subscription: SubscriptionDto): Promise<void>;
}
