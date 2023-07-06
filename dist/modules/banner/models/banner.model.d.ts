import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class BannerModel extends Document {
    fileId: ObjectId;
    title: string;
    description: string;
    link: string;
    status: string;
    position: string;
    createdBy: ObjectId;
    updatedBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
