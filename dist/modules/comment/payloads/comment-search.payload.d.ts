import { SearchRequest } from 'src/kernel/common';
import { ObjectId } from 'mongodb';
export declare class CommentSearchRequestPayload extends SearchRequest {
    objectId?: string | ObjectId;
    objectType?: string;
}
