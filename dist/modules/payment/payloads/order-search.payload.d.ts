import { SearchRequest } from 'src/kernel/common';
export declare class OrderSearchPayload extends SearchRequest {
    userId: string;
    buyerId: string;
    sellerId: string;
    deliveryStatus: string;
    status: string;
    fromDate: Date;
    toDate: Date;
}
export declare class OrderUpdatePayload extends SearchRequest {
    deliveryStatus: string;
    shippingCode: string;
}
