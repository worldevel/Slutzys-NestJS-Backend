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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const file_1 = require("../../file");
const auth_1 = require("../../auth");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
let MessageController = class MessageController {
    constructor(messageService, notificationMessageService) {
        this.messageService = messageService;
        this.notificationMessageService = notificationMessageService;
    }
    async createMessage(payload, conversationId, req) {
        const data = await this.messageService.createPrivateMessage(conversationId, payload, {
            source: req.authUser.source,
            sourceId: req.authUser.sourceId
        });
        return kernel_1.DataResponse.ok(data);
    }
    async createPrivateFileMessage(files, payload, req) {
        if (req.authUser.sourceId.toString() === payload.recipientId.toString()) {
            throw new common_1.ForbiddenException();
        }
        const message = await this.messageService.createPrivateFileMessage({
            source: req.authUser.source,
            sourceId: req.authUser.sourceId
        }, {
            source: payload.recipientType,
            sourceId: payload.recipientId
        }, files['message-photo'], payload);
        return kernel_1.DataResponse.ok(message);
    }
    async readAllMessage(conversationId, user) {
        const message = await this.notificationMessageService.recipientReadAllMessageInConversation(user, conversationId);
        return kernel_1.DataResponse.ok(message);
    }
    async countTotalNotReadMessage(user) {
        const data = await this.notificationMessageService.countTotalNotReadMessage(user._id.toString());
        return kernel_1.DataResponse.ok(data);
    }
    async loadMessages(req, conversationId, user) {
        req.conversationId = conversationId;
        const data = await this.messageService.loadMessages(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async deletePublicMessage(messageId, user) {
        const data = await this.messageService.deleteMessage(messageId, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Post('/conversations/:conversationId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('conversationId')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageCreatePayload, String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createMessage", null);
__decorate([
    common_1.Post('/private/file'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UseInterceptors(file_1.MultiFileUploadInterceptor([
        {
            type: 'message-photo',
            fieldName: 'message-photo',
            options: {
                destination: kernel_1.getConfig('file').imageDir
            }
        }
    ])),
    __param(0, file_1.FilesUploaded()),
    __param(1, common_1.Body()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payloads_1.PrivateMessageCreatePayload, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createPrivateFileMessage", null);
__decorate([
    common_1.Post('/read-all/:conversationId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('conversationId')),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "readAllMessage", null);
__decorate([
    common_1.Get('/counting-not-read-messages'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "countTotalNotReadMessage", null);
__decorate([
    common_1.Get('/conversations/:conversationId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Param('conversationId')),
    __param(2, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageListRequest, String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "loadMessages", null);
__decorate([
    common_1.Delete('/:messageId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('messageId')),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deletePublicMessage", null);
MessageController = __decorate([
    common_1.Injectable(),
    common_1.Controller('messages'),
    __metadata("design:paramtypes", [services_1.MessageService,
        services_1.NotificationMessageService])
], MessageController);
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map