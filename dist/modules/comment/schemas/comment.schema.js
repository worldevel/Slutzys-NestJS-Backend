"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = void 0;
const mongoose = require("mongoose");
exports.CommentSchema = new mongoose.Schema({
    content: String,
    objectType: {
        type: String,
        default: 'video',
        index: true
    },
    objectId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    totalReply: {
        type: Number,
        default: 0
    },
    totalLike: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=comment.schema.js.map