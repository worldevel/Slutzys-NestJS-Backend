import { Model } from 'mongoose';
import { CCBillService } from 'src/modules/payment/services';
import { SettingService } from 'src/modules/settings/services';
import { MailerService } from 'src/modules/mailer';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { SubscriptionModel } from '../models/subscription.model';
export declare class CancelSubscriptionService {
    private readonly ccbillService;
    private readonly performerService;
    private readonly userService;
    private readonly subscriptionModel;
    private readonly settingService;
    private readonly mailService;
    constructor(ccbillService: CCBillService, performerService: PerformerService, userService: UserService, subscriptionModel: Model<SubscriptionModel>, settingService: SettingService, mailService: MailerService);
    cancelSubscription(id: string): Promise<{
        success: boolean;
    }>;
}
