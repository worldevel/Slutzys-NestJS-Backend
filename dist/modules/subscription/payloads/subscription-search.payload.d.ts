import { SearchRequest } from 'src/kernel/common';
import { ObjectId } from 'mongodb';
export declare class SubscriptionSearchRequestPayload extends SearchRequest {
    userId?: string | ObjectId;
    performerId?: string | ObjectId;
    transactionId?: string | ObjectId;
    subscriptionId?: string;
    subscriptionType?: string;
    paymentGateway?: string;
    status?: string;
    createdAt?: Date;
    expiredAt?: Date;
}
