import { ObjectId } from 'mongodb';
export declare class EarningDto {
    _id: ObjectId;
    userId: ObjectId;
    userInfo?: any;
    transactionId: ObjectId;
    transactionInfo?: any;
    performerId: ObjectId;
    performerInfo?: any;
    order?: any;
    sourceType: string;
    grossPrice: number;
    netPrice: number;
    commission: number;
    isPaid?: boolean;
    createdAt: Date;
    paidAt?: Date;
    transactionStatus?: string;
    constructor(data?: Partial<EarningDto>);
}
export interface IEarningStatResponse {
    totalGrossPrice: number;
    totalNetPrice: number;
    totalCommission: number;
}
