import { Model } from 'mongoose';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { UserDto } from 'src/modules/user/dtos';
import { NotificationMessageModel } from '../models';
export declare class NotificationMessageService {
    private readonly notificationMessageModel;
    private readonly socketUserService;
    constructor(notificationMessageModel: Model<NotificationMessageModel>, socketUserService: SocketUserService);
    recipientReadAllMessageInConversation(user: UserDto, conversationId: string): Promise<any>;
    countTotalNotReadMessage(userId: string): Promise<any>;
}
