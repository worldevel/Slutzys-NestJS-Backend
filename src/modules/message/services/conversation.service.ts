import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { toObjectId } from 'src/kernel/helpers/string.helper';
import { UserSearchService, UserService } from 'src/modules/user/services';
import { PerformerService, PerformerSearchService } from 'src/modules/performer/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { SUBSCRIPTION_STATUS } from 'src/modules/subscription/constants';
import { PerformerSearchPayload } from 'src/modules/performer/payloads';
import { UserSearchRequestPayload } from 'src/modules/user/payloads';
import { PerformerBlockService } from 'src/modules/block/services';
import { ConversationSearchPayload } from '../payloads';
import { ConversationDto } from '../dtos';
import { CONVERSATION_TYPE } from '../constants';
import { ConversationModel, NotificationMessageModel } from '../models';
import {
  CONVERSATION_MODEL_PROVIDER, NOTIFICATION_MESSAGE_MODEL_PROVIDER
} from '../providers';

export interface IRecipient {
  source: string;
  sourceId: ObjectId;
}

@Injectable()
export class ConversationService {
  constructor(
    @Inject(CONVERSATION_MODEL_PROVIDER)
    private readonly conversationModel: Model<ConversationModel>,
    private readonly userService: UserService,
    private readonly userSearchService: UserSearchService,
    private readonly performerService: PerformerService,
    private readonly performerSearchService: PerformerSearchService,
    private readonly subscriptionService: SubscriptionService,
    private readonly performerBlockService: PerformerBlockService,
    @Inject(NOTIFICATION_MESSAGE_MODEL_PROVIDER)
    private readonly notiticationMessageModel: Model<NotificationMessageModel>
  ) {}

  public async findOne(params): Promise<ConversationModel> {
    return this.conversationModel.findOne(params);
  }

  public async createPrivateConversation(
    sender: IRecipient,
    receiver: IRecipient
  ): Promise<ConversationDto> {
    let conversation = await this.conversationModel
      .findOne({
        type: CONVERSATION_TYPE.PRIVATE,
        recipients: {
          $all: [
            {
              source: sender.source,
              sourceId: toObjectId(sender.sourceId)
            },
            {
              source: receiver.source,
              sourceId: receiver.sourceId
            }
          ]
        }
      })
      .lean()
      .exec();
    if (!conversation) {
      conversation = await this.conversationModel.create({
        type: CONVERSATION_TYPE.PRIVATE,
        recipients: [sender, receiver],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // TODO - define DTO?
    const dto = new ConversationDto(conversation);
    dto.totalNotSeenMessages = 0;
    if (receiver.source === 'performer') {
      const per = await this.performerService.findById(receiver.sourceId);
      if (per) {
        dto.recipientInfo = new PerformerDto(per).toResponse(false);
        const subscribed = await this.subscriptionService.checkSubscribed(
          per._id,
          sender.sourceId
        );
        dto.isSubscribed = !!subscribed;
      }
    }
    if (receiver.source === 'user') {
      dto.isSubscribed = true;
      const user = await this.userService.findById(receiver.sourceId);
      if (user) dto.recipientInfo = new UserDto(user).toResponse(false);
    }
    return dto;
  }

  public async getList(
    req: ConversationSearchPayload,
    sender: IRecipient,
    countryCode?: string
  ): Promise<any> {
    let query = {
      recipients: {
        $elemMatch: {
          source: sender.source,
          sourceId: toObjectId(sender.sourceId)
        }
      }
    } as any;
    // must be the first
    if (req.keyword) {
      let usersSearch = null;
      if (sender.source === 'user') {
        usersSearch = await this.performerSearchService.searchByKeyword({ q: req.keyword } as PerformerSearchPayload);
      }
      if (sender.source === 'performer') {
        usersSearch = await this.userSearchService.searchByKeyword({ q: req.keyword } as UserSearchRequestPayload);
      }
      const Ids = usersSearch ? usersSearch.map((u) => u._id) : [];
      query = {
        $and: [{
          recipients: {
            $elemMatch: {
              source: sender.source === 'user' ? 'performer' : 'user',
              sourceId: { $in: Ids }
            }
          }
        },
        {
          recipients: {
            $elemMatch: {
              source: sender.source,
              sourceId: toObjectId(sender.sourceId)
            }
          }
        }]
      };
    }

    if (req.type) {
      query.type = req.type;
    }

    const [data, total] = await Promise.all([
      this.conversationModel
        .find(query)
        .lean()
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10))
        .sort({ lastMessageCreatedAt: -1, updatedAt: -1 }),
      this.conversationModel.countDocuments(query)
    ]);

    const conversations = data.map((d) => new ConversationDto(d));
    const recipientIds = conversations.map((c) => {
      const re = c.recipients.find(
        (rep) => rep.sourceId.toString() !== sender.sourceId.toString()
      );
      if (re) {
        return re.sourceId;
      }
      return null;
    });
    const conversationIds = data.map((d) => d._id);
    let subscriptions = [];
    let blockedUsers = null;
    let blockCountries = [];
    const [notifications] = await Promise.all([
      this.notiticationMessageModel.find({
        conversationId: { $in: conversationIds },
        recipientId: sender.sourceId
      })
    ]);
    const recipients = (sender.source === 'user' ? await this.performerService.findByIds(recipientIds) : await this.userService.findByIds(recipientIds)) as any || [];
    if (sender.source === 'user') {
      if (recipients) {
        const pIds = recipients.map((p) => p._id);
        subscriptions = await this.subscriptionService.findSubscriptionList({
          performerId: { $in: pIds },
          userId: sender.sourceId,
          expiredAt: { $gt: new Date() },
          status: SUBSCRIPTION_STATUS.ACTIVE
        });
        blockCountries = await this.performerBlockService.findBlockCountriesByQuery({ sourceId: { $in: pIds } });
        blockedUsers = await this.performerBlockService.listByQuery({ sourceId: { $in: pIds }, targetId: sender.sourceId });
      }
    }

    conversations.forEach((conversation: ConversationDto) => {
      const recipient = conversation.recipients.find((rep) => `${rep.sourceId}` !== `${sender.sourceId}`);
      if (recipient) {
        // eslint-disable-next-line no-param-reassign
        conversation.isSubscribed = sender.source === 'performer';
        const recipientInfo = recipients.find((r) => `${r._id}` === `${recipient.sourceId}`);
        if (recipientInfo) {
          // eslint-disable-next-line no-param-reassign
          conversation.recipientInfo = sender.source === 'performer' ? new UserDto(recipientInfo).toResponse() : new PerformerDto(recipientInfo).toPublicDetailsResponse();
          if (sender.source === 'user') {
            let isBlocked = false;
            if (blockedUsers.length) {
              const isBlockedUser = blockedUsers.find((s) => `${s.sourceId}` === `${recipient.sourceId}`);
              isBlocked = !!isBlockedUser;
            }
            if (countryCode && !isBlocked) {
              const isBlockeCountry = blockCountries.find((b) => `${b.sourceId}` === `${recipient.sourceId}` && b.countryCodes.includes(countryCode));
              isBlocked = !!isBlockeCountry;
            }
            const isSubscribed = subscriptions.find((s) => `${s.performerId}` === `${recipientInfo._id}`);
            // eslint-disable-next-line no-param-reassign
            conversation.isSubscribed = !!isSubscribed;
            // eslint-disable-next-line no-param-reassign
            conversation.isBlocked = !!isBlocked;
          }
        }
        // eslint-disable-next-line no-param-reassign
        conversation.totalNotSeenMessages = 0;
        if (notifications.length) {
          const conversationNotifications = notifications.find(
            (n) => n.conversationId.toString() === conversation._id.toString()
          );
          // eslint-disable-next-line no-param-reassign
          conversation.totalNotSeenMessages = conversationNotifications?.totalNotReadMessage || 0;
        }
      }
    });

    return {
      data: conversations,
      total
    };
  }

  public async findById(id: string | ObjectId) {
    return this.conversationModel
      .findOne({
        _id: id
      })
      .lean()
      .exec();
  }

  public async addRecipient(
    conversationId: string | ObjectId,
    recipient: IRecipient
  ) {
    return this.conversationModel.updateOne({ _id: conversationId }, { $addToSet: { recipients: recipient } });
  }
}
