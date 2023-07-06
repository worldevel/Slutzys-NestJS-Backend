import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { ObjectId } from 'mongodb';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import { SubscriptionModel } from '../models/subscription.model';
import { SubscriptionCreatePayload, SubscriptionSearchRequestPayload } from '../payloads';
import { SubscriptionDto } from '../dtos/subscription.dto';
export declare class SubscriptionService {
    private readonly performerService;
    private readonly userService;
    private readonly subscriptionModel;
    constructor(performerService: PerformerService, userService: UserService, subscriptionModel: Model<SubscriptionModel>);
    findSubscriptionList(query: any): Promise<SubscriptionModel[]>;
    countSubscriptions(query: any): Promise<number>;
    adminCreate(data: SubscriptionCreatePayload): Promise<SubscriptionDto>;
    adminSearch(req: SubscriptionSearchRequestPayload): Promise<PageableData<SubscriptionDto>>;
    performerSearch(req: SubscriptionSearchRequestPayload, user: UserDto): Promise<PageableData<SubscriptionDto>>;
    userSearch(req: SubscriptionSearchRequestPayload, user: UserDto): Promise<PageableData<SubscriptionDto>>;
    checkSubscribed(performerId: string | ObjectId, userId: string | ObjectId): Promise<any>;
    findOneSubscription(performerId: string | ObjectId, userId: string | ObjectId): Promise<SubscriptionModel>;
    performerTotalSubscriptions(performerId: string | ObjectId): Promise<number>;
    findById(id: string | ObjectId): Promise<SubscriptionModel>;
    delete(id: string | ObjectId): Promise<boolean>;
    findBySubscriptionId(subscriptionId: string): Promise<SubscriptionModel>;
}
