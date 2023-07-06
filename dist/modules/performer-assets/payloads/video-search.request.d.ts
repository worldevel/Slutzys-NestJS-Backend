import { SearchRequest } from 'src/kernel/common';
import { ObjectId } from 'mongodb';
export declare class VideoSearchRequest extends SearchRequest {
    performerId: string;
    excludedId: string;
    status: string;
    isSaleVideo: any;
    ids?: string[] | ObjectId[];
}
