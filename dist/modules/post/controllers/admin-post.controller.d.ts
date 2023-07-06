import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto } from 'src/modules/file';
import { PostCreatePayload, AdminSearch } from '../payloads';
import { PostModel } from '../models';
import { PostService, PostSearchService } from '../services';
export declare class AdminPostController {
    private readonly postService;
    private readonly postSearchService;
    constructor(postService: PostService, postSearchService: PostSearchService);
    create(currentUser: UserDto, payload: PostCreatePayload): Promise<DataResponse<PostModel>>;
    update(currentUser: UserDto, payload: PostCreatePayload, id: string): Promise<DataResponse<PostModel>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    uploadImage(user: UserDto, file: FileDto): Promise<any>;
    adminSearch(req: AdminSearch): Promise<DataResponse<PageableData<PostModel>>>;
    adminGetDetails(id: string): Promise<DataResponse<any>>;
}
