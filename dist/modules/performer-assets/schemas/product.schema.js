"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.ProductSchema = new mongoose_1.Schema({
    performerId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    digitalFileId: mongodb_1.ObjectId,
    imageIds: [{
            _id: false,
            type: mongoose_1.Schema.Types.ObjectId
        }],
    categoryIds: [{
            _id: false,
            type: mongoose_1.Schema.Types.ObjectId
        }],
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
    type: {
        type: String,
        default: 'physical'
    },
    status: {
        type: String,
        default: 'active'
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
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
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=product.schema.js.map