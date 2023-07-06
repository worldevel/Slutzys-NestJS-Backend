import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { MessageService, NotificationMessageService } from '../services';
import { MessageListRequest, MessageCreatePayload, PrivateMessageCreatePayload } from '../payloads';
import { MessageDto } from '../dtos';
export declare class MessageController {
    private readonly messageService;
    private readonly notificationMessageService;
    constructor(messageService: MessageService, notificationMessageService: NotificationMessageService);
    createMessage(payload: MessageCreatePayload, conversationId: string, req: any): Promise<DataResponse<any>>;
    createPrivateFileMessage(files: Record<string, any>, payload: PrivateMessageCreatePayload, req: any): Promise<DataResponse<MessageDto>>;
    readAllMessage(conversationId: string, user: UserDto): Promise<DataResponse<MessageDto>>;
    countTotalNotReadMessage(user: UserDto): Promise<DataResponse<any>>;
    loadMessages(req: MessageListRequest, conversationId: string, user: UserDto): Promise<DataResponse<any>>;
    deletePublicMessage(messageId: string, user: UserDto): Promise<DataResponse<any>>;
}
