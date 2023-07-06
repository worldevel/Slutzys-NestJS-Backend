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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../user/dtos");
const file_1 = require("../../file");
const services_1 = require("../../file/services");
const constants_1 = require("../../file/constants");
const message_provider_1 = require("../providers/message.provider");
const constants_2 = require("../constants");
const dtos_2 = require("../dtos");
const conversation_service_1 = require("./conversation.service");
let MessageService = class MessageService {
    constructor(messageModel, queueEventService, fileService, conversationService) {
        this.messageModel = messageModel;
        this.queueEventService = queueEventService;
        this.fileService = fileService;
        this.conversationService = conversationService;
    }
    async createPrivateMessage(conversationId, payload, sender) {
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const found = conversation.recipients.find((recipient) => recipient.sourceId.toString() === sender.sourceId.toString());
        if (!found) {
            throw new kernel_1.EntityNotFoundException();
        }
        const message = await this.messageModel.create(Object.assign(Object.assign({}, payload), { senderId: sender.sourceId, senderSource: sender.source, conversationId: conversation._id }));
        const dto = new dtos_2.MessageDto(message);
        await this.queueEventService.publish({
            channel: constants_2.MESSAGE_CHANNEL,
            eventName: constants_2.MESSAGE_EVENT.CREATED,
            data: dto
        });
        return dto;
    }
    async createPrivateFileMessage(sender, recipient, file, payload) {
        const conversation = await this.conversationService.createPrivateConversation(sender, recipient);
        if (!file)
            throw new common_1.HttpException('File is valid!', 400);
        if (!file.isImage()) {
            await this.fileService.removeIfNotHaveRef(file._id);
            throw new common_1.HttpException('Invalid image!', 400);
        }
        const message = await this.messageModel.create(Object.assign(Object.assign({}, payload), { type: constants_2.MESSAGE_TYPE.PHOTO, senderId: sender.sourceId, fileId: file._id, senderSource: sender.source, conversationId: conversation._id, createdAt: new Date(), updatedAt: new Date() }));
        await this.fileService.addRef(file._id, {
            itemType: constants_1.REF_TYPE.MESSAGE,
            itemId: message._id
        });
        const dto = new dtos_2.MessageDto(message);
        dto.imageUrl = file.getUrl();
        await this.queueEventService.publish({
            channel: constants_2.MESSAGE_CHANNEL,
            eventName: constants_2.MESSAGE_EVENT.CREATED,
            data: dto
        });
        return dto;
    }
    async loadMessages(req, user) {
        const conversation = await this.conversationService.findById(req.conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const found = conversation.recipients.find((recipient) => recipient.sourceId.toString() === user._id.toString());
        if (!found) {
            throw new kernel_1.EntityNotFoundException();
        }
        const query = { conversationId: conversation._id };
        const [data, total] = await Promise.all([
            this.messageModel
                .find(query)
                .sort({ createdAt: -1 })
                .lean()
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.messageModel.countDocuments(query)
        ]);
        const fileIds = data.map((d) => d.fileId);
        const files = await this.fileService.findByIds(fileIds);
        const messages = data.map((m) => new dtos_2.MessageDto(m));
        messages.forEach((message) => {
            if (message.fileId) {
                const file = files.find((f) => f._id.toString() === message.fileId.toString());
                message.imageUrl = file ? file.getUrl() : null;
            }
        });
        return {
            data: messages,
            total
        };
    }
    async deleteMessage(messageId, user) {
        const message = await this.messageModel.findById(messageId);
        if (!message) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.roles
            && !user.roles.includes('admin')
            && message.senderId.toString() !== user._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        await message.remove();
        if (message.type === constants_2.MESSAGE_TYPE.PHOTO) {
            message.fileId && await this.fileService.remove(message.fileId);
        }
        await this.queueEventService.publish({
            channel: constants_2.MESSAGE_PRIVATE_STREAM_CHANNEL,
            eventName: constants_2.MESSAGE_EVENT.DELETED,
            data: new dtos_2.MessageDto(message)
        });
        return message;
    }
};
MessageService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(message_provider_1.MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.FileService,
        conversation_service_1.ConversationService])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map