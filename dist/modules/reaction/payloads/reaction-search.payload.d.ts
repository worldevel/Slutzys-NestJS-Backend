import { SearchRequest } from 'src/kernel/common';
import { ObjectId } from 'mongodb';
export declare class ReactionSearchRequestPayload extends SearchRequest {
    objectId?: string | ObjectId;
    action?: string;
    objectType?: string;
    createdBy?: string | ObjectId;
}
