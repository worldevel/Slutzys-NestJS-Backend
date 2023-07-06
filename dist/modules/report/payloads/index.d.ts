import { SearchRequest } from 'src/kernel/common';
export declare class ReportSearchRequestPayload extends SearchRequest {
    targetId?: string;
    target?: string;
    source?: string;
    sourceId?: string;
    performerId?: string;
}
export declare class ReportCreatePayload {
    target: string;
    targetId: string;
    title: string;
    description: string;
}
