import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class ReportModel extends Document {
    title: string;
    description: string;
    source: string;
    sourceId: ObjectId;
    performerId: ObjectId;
    target: string;
    targetId: ObjectId;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
