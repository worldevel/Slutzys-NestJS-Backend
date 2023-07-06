import { QueueEventService, QueueEvent } from 'src/kernel';
import { CommentService } from '../services/comment.service';
export declare class ReplyCommentListener {
    private readonly queueEventService;
    private readonly commentService;
    constructor(queueEventService: QueueEventService, commentService: CommentService);
    handleReplyComment(event: QueueEvent): Promise<boolean>;
}
