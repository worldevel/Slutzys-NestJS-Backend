"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactSchema = void 0;
const mongoose = require("mongoose");
exports.ReactSchema = new mongoose.Schema({
    action: {
        type: String,
        default: 'like',
        index: true
    },
    objectType: {
        type: String,
        default: 'video',
        index: true
    },
    objectId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
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
//# sourceMappingURL=reaction.schema.js.map