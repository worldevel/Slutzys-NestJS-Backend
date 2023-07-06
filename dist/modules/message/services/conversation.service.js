"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const constants_1 = require("../../subscription/constants");
const payloads_1 = require("../../performer/payloads");
const payloads_2 = require("../../user/payloads");
const services_3 = require("../../block/services");
const dtos_3 = require("../dtos");
const constants_2 = require("../constants");
const providers_1 = require("../providers");
let ConversationService = class ConversationService {
    constructor(conversationModel, userService, userSearchService, performerService, performerSearchService, subscriptionService, performerBlockService, notiticationMessageModel) {
        this.conversationModel = conversationModel;
        this.userService = userService;
        this.userSearchService = userSearchService;
        this.performerService = performerService;
        this.performerSearchService = performerSearchService;
        this.subscriptionService = subscriptionService;
        this.performerBlockService = performerBlockService;
        this.notiticationMessageModel = notiticationMessageModel;
    }
    async findOne(params) {
        return this.conversationModel.findOne(params);
    }
    async createPrivateConversation(sender, receiver) {
        let conversation = await this.conversationModel
            .findOne({
            type: constants_2.CONVERSATION_TYPE.PRIVATE,
            recipients: {
                $all: [
                    {
                        source: sender.source,
                        sourceId: string_helper_1.toObjectId(sender.sourceId)
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
                type: constants_2.CONVERSATION_TYPE.PRIVATE,
                recipients: [sender, receiver],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        const dto = new dtos_3.ConversationDto(conversation);
        dto.totalNotSeenMessages = 0;
        if (receiver.source === 'performer') {
            const per = await this.performerService.findById(receiver.sourceId);
            if (per) {
                dto.recipientInfo = new dtos_2.PerformerDto(per).toResponse(false);
                const subscribed = await this.subscriptionService.checkSubscribed(per._id, sender.sourceId);
                dto.isSubscribed = !!subscribed;
            }
        }
        if (receiver.source === 'user') {
            dto.isSubscribed = true;
            const user = await this.userService.findById(receiver.sourceId);
            if (user)
                dto.recipientInfo = new dtos_1.UserDto(user).toResponse(false);
        }
        return dto;
    }
    async getList(req, sender, countryCode) {
        let query = {
            recipients: {
                $elemMatch: {
                    source: sender.source,
                    sourceId: string_helper_1.toObjectId(sender.sourceId)
                }
            }
        };
        if (req.keyword) {
            let usersSearch = null;
            if (sender.source === 'user') {
                usersSearch = await this.performerSearchService.searchByKeyword({ q: req.keyword });
            }
            if (sender.source === 'performer') {
                usersSearch = await this.userSearchService.searchByKeyword({ q: req.keyword });
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
                                sourceId: string_helper_1.toObjectId(sender.sourceId)
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
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10))
                .sort({ lastMessageCreatedAt: -1, updatedAt: -1 }),
            this.conversationModel.countDocuments(query)
        ]);
        const conversations = data.map((d) => new dtos_3.ConversationDto(d));
        const recipientIds = conversations.map((c) => {
            const re = c.recipients.find((rep) => rep.sourceId.toString() !== sender.sourceId.toString());
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
        const recipients = (sender.source === 'user' ? await this.performerService.findByIds(recipientIds) : await this.userService.findByIds(recipientIds)) || [];
        if (sender.source === 'user') {
            if (recipients) {
                const pIds = recipients.map((p) => p._id);
                subscriptions = await this.subscriptionService.findSubscriptionList({
                    performerId: { $in: pIds },
                    userId: sender.sourceId,
                    expiredAt: { $gt: new Date() },
                    status: constants_1.SUBSCRIPTION_STATUS.ACTIVE
                });
                blockCountries = await this.performerBlockService.findBlockCountriesByQuery({ sourceId: { $in: pIds } });
                blockedUsers = await this.performerBlockService.listByQuery({ sourceId: { $in: pIds }, targetId: sender.sourceId });
            }
        }
        conversations.forEach((conversation) => {
            const recipient = conversation.recipients.find((rep) => `${rep.sourceId}` !== `${sender.sourceId}`);
            if (recipient) {
                conversation.isSubscribed = sender.source === 'performer';
                const recipientInfo = recipients.find((r) => `${r._id}` === `${recipient.sourceId}`);
                if (recipientInfo) {
                    conversation.recipientInfo = sender.source === 'performer' ? new dtos_1.UserDto(recipientInfo).toResponse() : new dtos_2.PerformerDto(recipientInfo).toPublicDetailsResponse();
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
                        conversation.isSubscribed = !!isSubscribed;
                        conversation.isBlocked = !!isBlocked;
                    }
                }
                conversation.totalNotSeenMessages = 0;
                if (notifications.length) {
                    const conversationNotifications = notifications.find((n) => n.conversationId.toString() === conversation._id.toString());
                    conversation.totalNotSeenMessages = (conversationNotifications === null || conversationNotifications === void 0 ? void 0 : conversationNotifications.totalNotReadMessage) || 0;
                }
            }
        });
        return {
            data: conversations,
            total
        };
    }
    async findById(id) {
        return this.conversationModel
            .findOne({
            _id: id
        })
            .lean()
            .exec();
    }
    async addRecipient(conversationId, recipient) {
        return this.conversationModel.updateOne({ _id: conversationId }, { $addToSet: { recipients: recipient } });
    }
};
ConversationService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.CONVERSATION_MODEL_PROVIDER)),
    __param(7, common_1.Inject(providers_1.NOTIFICATION_MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.UserService,
        services_1.UserSearchService,
        services_2.PerformerService,
        services_2.PerformerSearchService,
        subscription_service_1.SubscriptionService,
        services_3.PerformerBlockService,
        mongoose_1.Model])
], ConversationService);
exports.ConversationService = ConversationService;
//# sourceMappingURL=conversation.service.js.map