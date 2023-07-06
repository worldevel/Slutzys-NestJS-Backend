import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class ReactionModel extends Document {
    objectId: ObjectId;
    action?: string;
    creator?: any;
    objectType?: string;
    createdBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
