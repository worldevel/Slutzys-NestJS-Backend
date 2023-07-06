import { SearchRequest } from 'src/kernel/common';
export declare class CategorySearchRequest extends SearchRequest {
    status: string;
    group: string;
    slug: string;
    includedIds: string[];
}
