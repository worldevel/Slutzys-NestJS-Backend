import { ObjectId } from 'mongodb';
export declare class PostCreatePayload {
    title: string;
    authorId: ObjectId;
    type: string;
    slug: string;
    ordering: number;
    content: string;
    shortDescription: string;
    categoryIds: string[];
    status: string;
    image: string;
}
