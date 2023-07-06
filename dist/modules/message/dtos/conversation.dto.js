"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationDto = void 0;
const lodash_1 = require("lodash");
const dtos_1 = require("../../user/dtos");
class ConversationDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'type',
            'name',
            'recipients',
            'lastMessage',
            'lastSenderId',
            'lastMessageCreatedAt',
            'meta',
            'createdAt',
            'updatedAt',
            'recipientInfo',
            'totalNotSeenMessages',
            'isSubscribed',
            'isBlocked'
        ]));
    }
}
exports.ConversationDto = ConversationDto;
//# sourceMappingURL=conversation.dto.js.map