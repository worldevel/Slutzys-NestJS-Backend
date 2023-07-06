import { ObjectId } from 'mongodb';
export declare class ReactionDto {
    source?: string;
    action?: string;
    objectId?: ObjectId;
    objectType?: string;
    createdBy?: string | ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    creator?: any;
    objectInfo?: any;
    isSubscribed?: boolean;
    isBought?: boolean;
    constructor(data?: Partial<ReactionDto>);
}
