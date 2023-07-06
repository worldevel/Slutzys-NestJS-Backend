import { SearchRequest } from 'src/kernel';
export declare class AdminSearch extends SearchRequest {
    status?: string;
    type: string;
}
export declare class UserSearch extends SearchRequest {
    type: string;
}
