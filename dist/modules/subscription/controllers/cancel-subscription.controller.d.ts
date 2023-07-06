import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { SubscriptionService } from '../services/subscription.service';
import { CancelSubscriptionService } from '../services/cancel-subscription.service';
export declare class CancelSubscriptionController {
    private readonly subscriptionService;
    private readonly cancelSubscriptionService;
    constructor(subscriptionService: SubscriptionService, cancelSubscriptionService: CancelSubscriptionService);
    adminCancel(id: string): Promise<DataResponse<any>>;
    userCancel(id: string, user: UserDto): Promise<DataResponse<any>>;
}
