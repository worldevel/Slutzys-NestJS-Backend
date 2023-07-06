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
exports.NotificationMessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const dtos_1 = require("../../user/dtos");
const providers_1 = require("../providers");
let NotificationMessageService = class NotificationMessageService {
    constructor(notificationMessageModel, socketUserService) {
        this.notificationMessageModel = notificationMessageModel;
        this.socketUserService = socketUserService;
    }
    async recipientReadAllMessageInConversation(user, conversationId) {
        await this.notificationMessageModel.updateOne({
            recipientId: user._id,
            conversationId
        }, { totalNotReadMessage: 0 });
        const total = await this.countTotalNotReadMessage(user._id.toString());
        await this.socketUserService.emitToUsers(user._id, 'nofify_read_messages_in_conversation', total);
        return { ok: true };
    }
    async countTotalNotReadMessage(userId) {
        const totalNotReadMessage = await this.notificationMessageModel.aggregate([
            {
                $match: { recipientId: userId }
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
        if (!totalNotReadMessage || !totalNotReadMessage.length) {
            return { total };
        }
        totalNotReadMessage.forEach((data) => {
            if (data.total) {
                total += 1;
            }
        });
        return { total };
    }
};
NotificationMessageService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.NOTIFICATION_MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        socket_user_service_1.SocketUserService])
], NotificationMessageService);
exports.NotificationMessageService = NotificationMessageService;
//# sourceMappingURL=notification-message.service.js.map