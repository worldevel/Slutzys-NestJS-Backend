import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { ReactionService } from '../services/reaction.service';
import { ReactionCreatePayload, ReactionSearchRequestPayload } from '../payloads';
import { ReactionDto } from '../dtos/reaction.dto';
import { UserDto } from '../../user/dtos';
export declare class ReactionController {
    private readonly authService;
    private readonly reactionService;
    constructor(authService: AuthService, reactionService: ReactionService);
    create(user: UserDto, payload: ReactionCreatePayload): Promise<DataResponse<ReactionDto>>;
    remove(user: UserDto, payload: ReactionCreatePayload): Promise<DataResponse<boolean>>;
    favouriteVideos(req: ReactionSearchRequestPayload, request: any): Promise<DataResponse<PageableData<ReactionDto>>>;
    watchLaterVideos(req: ReactionSearchRequestPayload, request: any): Promise<DataResponse<PageableData<ReactionDto>>>;
}
