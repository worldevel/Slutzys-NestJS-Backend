import { SearchRequest } from 'src/kernel/common';
export declare class PerformerSearchPayload extends SearchRequest {
    name: string;
    q: string;
    performerIds: string[];
    gender: string;
    status: string;
    verifiedEmail: boolean;
    country: string;
    age: string;
}
