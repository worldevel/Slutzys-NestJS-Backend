import { ObjectId } from 'mongodb';
export declare class PayoutRequestDto {
    _id: any;
    source: string;
    sourceId: ObjectId;
    sourceInfo: any;
    paymentAccountInfo: any;
    paymentAccountType: string;
    requestNote: string;
    adminNote?: string;
    status: string;
    requestedPrice: number;
    fromDate: Date;
    toDate: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PayoutRequestDto>);
}
