import { Model } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { ObjectId } from 'mongodb';
import { CategorySearchRequest } from '../payloads/category-search.request';
import { CategoryModel } from '../models';
import { CategoryUpdatePayload } from '../payloads/category-update.payload';
import { CategoryCreatePayload } from '../payloads/category-create.payload';
export declare class CategoryService {
    private readonly categoryModel;
    constructor(categoryModel: Model<CategoryModel>);
    findByIds(ids: string[] | ObjectId[]): Promise<CategoryModel[]>;
    create(payload: CategoryCreatePayload, creator: UserDto): Promise<any>;
    update(id: string | ObjectId, payload: CategoryUpdatePayload, creator?: UserDto): Promise<any>;
    findByIdOrAlias(id: string | ObjectId): Promise<CategoryModel>;
    search(req: CategorySearchRequest): Promise<{
        data: Pick<Pick<import("mongoose")._LeanDocument<CategoryModel>, "updatedAt" | "_id" | "name" | "description" | "status" | "createdBy" | "updatedBy" | "createdAt" | "__v" | "id" | "group" | "ordering" | "slug">, "updatedAt" | "_id" | "name" | "description" | "status" | "createdBy" | "updatedBy" | "createdAt" | "__v" | "id" | "group" | "ordering" | "slug">[];
        total: number;
    }>;
    delete(id: string | ObjectId): Promise<boolean>;
}
