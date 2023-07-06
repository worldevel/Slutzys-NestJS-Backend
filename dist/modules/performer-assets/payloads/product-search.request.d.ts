import { SearchRequest } from 'src/kernel/common';
export declare class ProductSearchRequest extends SearchRequest {
    performerId: string;
    status: string;
    type: string;
    excludedId: string;
    includedIds: string[];
    categoryId: string;
}
