import { ObjectId } from 'mongodb';
export interface ISubscriptionResponse {
    _id?: string | ObjectId;
    subscriptionType?: string;
    userId?: string | ObjectId;
    performerId?: string | ObjectId;
    subscriptionId?: string;
    transactionId?: string | ObjectId;
    paymentGateway?: string;
    status?: string;
    meta?: any;
    startRecurringDate?: Date;
    nextRecurringDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    expiredAt?: Date;
    userInfo?: any;
    performerInfo?: any;
    blockedUser?: boolean;
}
export declare class SubscriptionDto {
    _id?: string | ObjectId;
    subscriptionType?: string;
    userId?: string | ObjectId;
    performerId?: string | ObjectId;
    subscriptionId?: string;
    transactionId?: string | ObjectId;
    paymentGateway?: string;
    status?: string;
    meta?: any;
    startRecurringDate?: Date;
    nextRecurringDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    expiredAt?: Date;
    userInfo?: any;
    performerInfo?: any;
    blockedUser?: boolean;
    constructor(data?: Partial<SubscriptionDto>);
    toResponse(includePrivateInfo?: boolean): {
        _id: string | ObjectId;
        subscriptionType: string;
        userId: string | ObjectId;
        userInfo: any;
        performerId: string | ObjectId;
        performerInfo: any;
        status: string;
        expiredAt: Date;
        blockedUser: boolean;
        startRecurringDate: Date;
        nextRecurringDate: Date;
        paymentGateway: string;
        createdAt: Date;
        updatedAt: Date;
    };
}
