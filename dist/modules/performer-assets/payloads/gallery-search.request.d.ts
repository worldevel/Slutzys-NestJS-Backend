import { SearchRequest } from 'src/kernel/common';
import { ObjectId } from 'mongodb';
export declare class GallerySearchRequest extends SearchRequest {
    performerId: string;
    excludedId: string;
    status: string;
    ids?: string[] | ObjectId[];
}
