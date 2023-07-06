import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class CommentModel extends Document {
    objectId: ObjectId;
    content?: string;
    creator?: any;
    objectType?: string;
    createdBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    totalReply: number;
    totalLike: number;
}
