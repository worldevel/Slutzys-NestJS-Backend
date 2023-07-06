"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.MessageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    type: {
        type: String,
        default: 'text',
        index: true
    },
    fileId: mongoose_1.Schema.Types.ObjectId,
    text: String,
    senderSource: String,
    senderId: mongoose_1.Schema.Types.ObjectId,
    meta: mongoose_1.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=message.schema.js.map