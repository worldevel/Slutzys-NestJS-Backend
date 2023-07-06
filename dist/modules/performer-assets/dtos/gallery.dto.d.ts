import { ObjectId } from 'mongodb';
import { GalleryModel } from '../models';
export declare class GalleryDto {
    _id: ObjectId;
    performerId: ObjectId;
    type: string;
    name: string;
    slug: string;
    description: string;
    status: string;
    processing: boolean;
    coverPhotoId: ObjectId;
    price: number;
    coverPhoto: Record<string, any>;
    performer: any;
    createdBy: ObjectId;
    updatedBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    isSale: boolean;
    isLiked: boolean;
    isSubscribed: boolean;
    isBought: boolean;
    numOfItems: number;
    stats: {
        likes: number;
        favourites: number;
        comments: number;
        views: number;
    };
    tags: string[];
    constructor(init: Partial<GalleryDto>);
    static fromModel(model: GalleryModel): GalleryDto;
}
