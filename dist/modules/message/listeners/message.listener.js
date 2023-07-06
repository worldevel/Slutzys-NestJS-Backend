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
exports.MessageListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const mongodb_1 = require("mongodb");
const constants_1 = require("../constants");
const providers_1 = require("../providers");
const MESSAGE_NOTIFY = 'MESSAGE_NOTIFY';
let MessageListener = class MessageListener {
    constructor(queueEventService, socketUserService, conversationModel, NotificationModel) {
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.conversationModel = conversationModel;
        this.NotificationModel = NotificationModel;
        this.queueEventService.subscribe(constants_1.MESSAGE_CHANNEL, MESSAGE_NOTIFY, this.handleMessage.bind(this));
    }
    async handleMessage(event) {
        if (event.eventName !== constants_1.MESSAGE_EVENT.CREATED)
            return;
        const message = event.data;
        const conversation = await this.conversationModel
            .findOne({ _id: message.conversationId })
            .lean()
            .exec();
        if (!conversation)
            return;
        const recipient = conversation.recipients.find((r) => r.sourceId.toString() !== message.senderId.toString());
        await this.updateNotification(conversation, recipient);
        await this.handleSent(recipient.sourceId, message);
        await this.updateLastMessage(conversation, message);
    }
    async updateLastMessage(conversation, message) {
        const lastMessage = kernel_1.StringHelper.truncate(message.text || '', 30);
        const lastSenderId = message.senderId;
        const lastMessageCreatedAt = message.createdAt;
        await this.conversationModel.updateOne({ _id: conversation._id }, {
            $set: {
                lastMessage,
                lastSenderId,
                lastMessageCreatedAt
            }
        });
    }
    async updateNotification(conversation, recipient) {
        let notification = await this.NotificationModel.findOne({
            recipientId: recipient.sourceId,
            conversationId: conversation._id
        });
        if (!notification) {
            notification = new this.NotificationModel({
                recipientId: recipient.sourceId,
                conversationId: conversation._id,
                totalNotReadMessage: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        notification.totalNotReadMessage += 1;
        await notification.save();
        const totalNotReadMessage = await this.NotificationModel.aggregate([
            {
                $match: { recipientId: recipient.sourceId }
            },
            {
                $group: {
                    _id: '$conversationId',
                    total: {
                        $sum: '$totalNotReadMessage'
                    }
                }
            }
        ]);
        let total = 0;
        totalNotReadMessage && totalNotReadMessage.length && totalNotReadMessage.forEach((data) => {
            if (data.total) {
                total += 1;
            }
        });
        await this.notifyCountingNotReadMessageInConversation(recipient.sourceId, total);
    }
    async notifyCountingNotReadMessageInConversation(receiverId, total) {
        await this.socketUserService.emitToUsers(new mongodb_1.ObjectId(receiverId), 'nofify_read_messages_in_conversation', { total });
    }
    async handleSent(recipientId, message) {
        await this.socketUserService.emitToUsers(recipientId, 'message_created', message);
    }
};
MessageListener = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject(providers_1.CONVERSATION_MODEL_PROVIDER)),
    __param(3, common_1.Inject(providers_1.NOTIFICATION_MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService,
        mongoose_1.Model,
        mongoose_1.Model])
], MessageListener);
exports.MessageListener = MessageListener;
//# sourceMappingURL=message.listener.js.map