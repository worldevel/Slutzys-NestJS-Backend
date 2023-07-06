import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class PhotoModel extends Document {
    performerId: ObjectId;
    galleryId: ObjectId;
    fileId: ObjectId;
    type: string;
    title: string;
    description: string;
    status: string;
    processing: boolean;
    isGalleryCover: boolean;
    price: number;
    createdBy: ObjectId;
    updatedBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
