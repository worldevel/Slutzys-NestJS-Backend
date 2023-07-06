"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GallerySchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.GallerySchema = new mongoose_1.Schema({
    performerId: { type: mongodb_1.ObjectId, index: true },
    type: {
        type: String,
        index: true
    },
    name: {
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
    price: {
        type: Number,
        default: 0
    },
    isSale: {
        type: Boolean,
        default: false
    },
    numOfItems: {
        type: Number,
        default: 0
    },
    stats: {
        likes: {
            type: Number,
            default: 0
        },
        favourites: {
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
    tags: [{ type: String, index: true }],
    coverPhotoId: mongodb_1.ObjectId,
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=gallery.schema.js.map