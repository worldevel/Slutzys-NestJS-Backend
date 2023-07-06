import { ObjectId } from 'mongodb';
import { MessageCreatePayload } from './message-create.payload';
export declare class PrivateMessageCreatePayload extends MessageCreatePayload {
    recipientId: ObjectId;
    recipientType: string;
}
