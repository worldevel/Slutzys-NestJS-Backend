import { ObjectId } from 'mongodb';
export declare class PhotoDto {
    _id?: ObjectId;
    performerId?: ObjectId;
    galleryId?: ObjectId;
    fileId?: ObjectId;
    photo?: any;
    type?: string;
    title?: string;
    description?: string;
    status?: string;
    processing?: boolean;
    price?: number;
    performer?: any;
    gallery?: any;
    isGalleryCover?: boolean;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(init?: Partial<PhotoDto>);
}
