import { DataResponse, PageableData } from 'src/kernel';
import { CommentService } from '../services/comment.service';
import { CommentCreatePayload, CommentEditPayload, CommentSearchRequestPayload } from '../payloads';
import { CommentDto } from '../dtos/comment.dto';
import { UserDto } from '../../user/dtos';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(user: UserDto, payload: CommentCreatePayload): Promise<DataResponse<CommentDto>>;
    update(id: string, currentUser: UserDto, payload: CommentEditPayload): Promise<DataResponse<any>>;
    search(req: CommentSearchRequestPayload, currentUser: UserDto): Promise<DataResponse<PageableData<CommentDto>>>;
    delete(id: string, currentUser: UserDto): Promise<DataResponse<any>>;
}
