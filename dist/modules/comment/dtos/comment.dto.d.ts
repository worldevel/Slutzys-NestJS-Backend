import { ObjectId } from 'mongodb';
export declare class CommentDto {
    _id: ObjectId;
    objectId?: ObjectId;
    content?: string;
    createdBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    creator?: any;
    objectType?: string;
    isLiked?: boolean;
    totalReply?: number;
    totalLike?: number;
    constructor(data?: Partial<CommentDto>);
}
