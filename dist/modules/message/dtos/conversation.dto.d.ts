import { ObjectId } from 'mongodb';
import { IUserResponse } from 'src/modules/user/dtos';
import { IRecipient } from '../models';
export declare class ConversationDto {
    _id: ObjectId;
    type: string;
    name: string;
    recipients: IRecipient[];
    lastMessage: string;
    lastSenderId: string | ObjectId;
    lastMessageCreatedAt: Date;
    meta: any;
    createdAt: Date;
    updatedAt: Date;
    recipientInfo?: IUserResponse;
    totalNotSeenMessages?: number;
    isSubscribed?: boolean;
    isBlocked?: boolean;
    constructor(data?: Partial<ConversationDto>);
}
