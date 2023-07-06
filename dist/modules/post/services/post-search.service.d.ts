import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { PostModel } from '../models';
import { AdminSearch, UserSearch } from '../payloads';
export declare class PostSearchService {
    private readonly postModel;
    constructor(postModel: Model<PostModel>);
    adminSearch(req: AdminSearch): Promise<PageableData<PostModel>>;
    userSearch(req: UserSearch): Promise<PageableData<PostModel>>;
}
