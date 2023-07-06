import { SearchRequest } from 'src/kernel/common';
import { ObjectId } from 'mongodb';
export declare class PayoutRequestCreatePayload {
    fromDate: Date;
    toDate: Date;
    requestNote: string;
    paymentAccountType: string;
}
export declare class PayoutRequestPerformerUpdatePayload {
    requestNote: string;
    fromDate: Date;
    toDate: Date;
    paymentAccountType: string;
}
export declare class PayoutRequestUpdatePayload {
    status: string;
    adminNote: string;
}
export declare class PayoutRequestSearchPayload extends SearchRequest {
    sourceId: ObjectId;
    paymentAccountType?: string;
    fromDate: Date;
    toDate: Date;
    status: string;
    source: string;
}
