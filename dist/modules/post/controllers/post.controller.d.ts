import { DataResponse, PageableData } from 'src/kernel';
import { PostService, PostSearchService } from '../services';
import { PostDto } from '../dtos';
import { PostModel } from '../models';
import { UserSearch } from '../payloads';
export declare class PostController {
    private readonly postService;
    private readonly postSearchService;
    constructor(postService: PostService, postSearchService: PostSearchService);
    details(id: string): Promise<DataResponse<PostDto>>;
    userSearch(req: UserSearch): Promise<DataResponse<PageableData<PostModel>>>;
}
