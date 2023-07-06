import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserSearchService, UserService } from 'src/modules/user/services';
import { PerformerService, PerformerSearchService } from 'src/modules/performer/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { PerformerBlockService } from 'src/modules/block/services';
import { ConversationSearchPayload } from '../payloads';
import { ConversationDto } from '../dtos';
import { ConversationModel, NotificationMessageModel } from '../models';
export interface IRecipient {
    source: string;
    sourceId: ObjectId;
}
export declare class ConversationService {
    private readonly conversationModel;
    private readonly userService;
    private readonly userSearchService;
    private readonly performerService;
    private readonly performerSearchService;
    private readonly subscriptionService;
    private readonly performerBlockService;
    private readonly notiticationMessageModel;
    constructor(conversationModel: Model<ConversationModel>, userService: UserService, userSearchService: UserSearchService, performerService: PerformerService, performerSearchService: PerformerSearchService, subscriptionService: SubscriptionService, performerBlockService: PerformerBlockService, notiticationMessageModel: Model<NotificationMessageModel>);
    findOne(params: any): Promise<ConversationModel>;
    createPrivateConversation(sender: IRecipient, receiver: IRecipient): Promise<ConversationDto>;
    getList(req: ConversationSearchPayload, sender: IRecipient, countryCode?: string): Promise<any>;
    findById(id: string | ObjectId): Promise<Pick<Pick<import("mongoose")._LeanDocument<ConversationModel>, "updatedAt" | "_id" | "type" | "name" | "createdAt" | "__v" | "id" | "meta" | "lastMessage" | "lastSenderId" | "recipients">, "updatedAt" | "_id" | "type" | "name" | "createdAt" | "__v" | "id" | "meta" | "lastMessage" | "lastSenderId" | "recipients">>;
    addRecipient(conversationId: string | ObjectId, recipient: IRecipient): Promise<any>;
}
