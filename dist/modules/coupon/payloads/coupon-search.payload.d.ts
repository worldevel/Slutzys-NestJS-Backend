import { SearchRequest } from 'src/kernel/common';
export declare class CouponSearchRequestPayload extends SearchRequest {
    name?: string;
    code?: string;
    status?: string;
}
