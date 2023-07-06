"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDto = void 0;
const lodash_1 = require("lodash");
class MessageDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id', 'conversationId', 'type', 'fileId', 'imageUrl', 'senderInfo',
            'text', 'senderId', 'meta', 'createdAt', 'updatedAt'
        ]));
    }
}
exports.MessageDto = MessageDto;
//# sourceMappingURL=message.dto.js.map