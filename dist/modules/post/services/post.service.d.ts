import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserDto } from 'src/modules/user/dtos';
import { FileService } from 'src/modules/file/services';
import { PostDto } from '../dtos';
import { PostCreatePayload } from '../payloads/post-create.payload';
import { PostModel } from '../models';
export declare class PostService {
    private readonly postModel;
    private readonly fileService;
    constructor(postModel: Model<PostModel>, fileService: FileService);
    find(params: any): Promise<PostModel[]>;
    findByIdOrSlug(id: string): Promise<PostModel>;
    generateSlug(title: string, id?: string | ObjectId): any;
    create(payload: PostCreatePayload, user?: UserDto): Promise<PostModel>;
    update(id: string, payload: PostCreatePayload, user?: UserDto): Promise<PostModel>;
    delete(id: string): Promise<boolean>;
    adminGetDetails(id: string): Promise<PostDto>;
    getPublic(id: string): Promise<PostDto>;
}
