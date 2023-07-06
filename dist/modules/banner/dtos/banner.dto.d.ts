import { ObjectId } from 'mongodb';
export declare class BannerDto {
    _id?: ObjectId;
    fileId?: ObjectId;
    title?: string;
    description?: string;
    link?: string;
    status?: string;
    position?: string;
    photo?: any;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(init?: Partial<BannerDto>);
}
