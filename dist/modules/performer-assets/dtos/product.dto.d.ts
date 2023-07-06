import { ObjectId } from 'mongodb';
export declare class ProductDto {
    _id?: ObjectId;
    performerId?: ObjectId;
    digitalFileId?: ObjectId;
    digitalFile?: any;
    imageIds?: ObjectId[];
    images?: any;
    categoryIds?: ObjectId[];
    categories?: any;
    type?: string;
    name?: string;
    slug?: string;
    description?: string;
    status?: string;
    price?: number;
    stock?: number;
    performer?: any;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    stats: {
        likes: number;
        comments: number;
        views: number;
    };
    isBought?: boolean;
    constructor(init?: Partial<ProductDto>);
    toPublic(): {
        _id: ObjectId;
        performerId: ObjectId;
        digitalFileId: ObjectId;
        digitalFile: any;
        imageIds: ObjectId[];
        images: any;
        categoryIds: ObjectId[];
        categories: any;
        type: string;
        name: string;
        slug: string;
        description: string;
        status: string;
        price: number;
        stock: number;
        performer: any;
        createdBy: ObjectId;
        updatedBy: ObjectId;
        createdAt: Date;
        updatedAt: Date;
        stats: {
            likes: number;
            comments: number;
            views: number;
        };
        isBought: boolean;
    };
}
