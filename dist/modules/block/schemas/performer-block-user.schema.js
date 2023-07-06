"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerBlockUserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PerformerBlockUserSchema = new mongoose_1.Schema({
    source: {
        type: String,
        index: true,
        default: 'performer'
    },
    sourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    target: {
        type: String,
        index: true,
        default: 'user'
    },
    targetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=performer-block-user.schema.js.map