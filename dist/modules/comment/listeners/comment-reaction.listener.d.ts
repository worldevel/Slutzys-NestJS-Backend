import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { Model } from 'mongoose';
import { CommentModel } from '../models/comment.model';
export declare class ReactionCommentListener {
    private readonly performerService;
    private readonly queueEventService;
    private readonly commentModel;
    constructor(performerService: PerformerService, queueEventService: QueueEventService, commentModel: Model<CommentModel>);
    handleReactComment(event: QueueEvent): Promise<void>;
}
