import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { MessageModel, IRecipient } from '../models';
import { MessageCreatePayload } from '../payloads/message-create.payload';
import { MessageDto } from '../dtos';
import { ConversationService } from './conversation.service';
import { MessageListRequest } from '../payloads/message-list.payload';
export declare class MessageService {
    private readonly messageModel;
    private readonly queueEventService;
    private readonly fileService;
    private readonly conversationService;
    constructor(messageModel: Model<MessageModel>, queueEventService: QueueEventService, fileService: FileService, conversationService: ConversationService);
    createPrivateMessage(conversationId: string | ObjectId, payload: MessageCreatePayload, sender: IRecipient): Promise<MessageDto>;
    createPrivateFileMessage(sender: IRecipient, recipient: IRecipient, file: FileDto, payload: MessageCreatePayload): Promise<MessageDto>;
    loadMessages(req: MessageListRequest, user: UserDto): Promise<{
        data: MessageDto[];
        total: number;
    }>;
    deleteMessage(messageId: string, user: UserDto): Promise<MessageModel>;
}
