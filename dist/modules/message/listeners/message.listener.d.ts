import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { ConversationModel, NotificationMessageModel } from '../models';
export declare class MessageListener {
    private readonly queueEventService;
    private readonly socketUserService;
    private readonly conversationModel;
    private readonly NotificationModel;
    constructor(queueEventService: QueueEventService, socketUserService: SocketUserService, conversationModel: Model<ConversationModel>, NotificationModel: Model<NotificationMessageModel>);
    private handleMessage;
    private updateLastMessage;
    private updateNotification;
    private notifyCountingNotReadMessageInConversation;
    private handleSent;
}
