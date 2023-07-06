"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.VideoSchema = new mongoose_1.Schema({
    performerId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    participantIds: [
        { index: true, type: String }
    ],
    fileId: mongodb_1.ObjectId,
    type: {
        type: String,
        index: true
    },
    title: {
        type: String
    },
    slug: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true
    },
    description: String,
    status: {
        type: String,
        default: 'active'
    },
    tags: [
        { type: String, index: true }
    ],
    isSchedule: {
        type: Boolean,
        default: false
    },
    isSaleVideo: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    processing: Boolean,
    teaserProcessing: Boolean,
    thumbnailId: mongodb_1.ObjectId,
    teaserId: mongodb_1.ObjectId,
    stats: {
        likes: {
            type: Number,
            default: 0
        },
        favourites: {
            type: Number,
            default: 0
        },
        wishlists: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        }
    },
    tagline: String,
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    scheduledAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=video.schema.js.map