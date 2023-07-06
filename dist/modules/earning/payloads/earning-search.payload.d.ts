import { SearchRequest } from 'src/kernel/common';
import { ObjectId } from 'mongodb';
export declare class EarningSearchRequestPayload extends SearchRequest {
    performerId?: string | ObjectId;
    transactionId?: string | ObjectId;
    sourceType?: string;
    fromDate?: string | Date;
    toDate?: Date;
    paidAt?: Date;
    isPaid?: boolean;
}
export declare class UpdateEarningStatusPayload {
    performerId: string;
    fromDate: string | Date;
    toDate: string | Date;
}
