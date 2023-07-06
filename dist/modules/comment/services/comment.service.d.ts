import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService, PageableData } from 'src/kernel';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { CommentModel } from '../models/comment.model';
import { CommentCreatePayload, CommentEditPayload, CommentSearchRequestPayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { CommentDto } from '../dtos/comment.dto';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
export declare class CommentService {
    private readonly performerService;
    private readonly userService;
    private readonly commentModel;
    private readonly queueEventService;
    private readonly reactionService;
    constructor(performerService: PerformerService, userService: UserService, commentModel: Model<CommentModel>, queueEventService: QueueEventService, reactionService: ReactionService);
    increaseComment(commentId: any, num?: number): Promise<void>;
    create(data: CommentCreatePayload, user: UserDto): Promise<CommentDto>;
    update(id: string | ObjectId, payload: CommentEditPayload, user: UserDto): Promise<any>;
    delete(id: string | ObjectId, user: UserDto): Promise<{
        deleted: boolean;
    }>;
    search(req: CommentSearchRequestPayload, user: UserDto): Promise<PageableData<CommentDto>>;
}
