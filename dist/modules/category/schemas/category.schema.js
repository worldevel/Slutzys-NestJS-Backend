"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.CategorySchema = new mongoose_1.Schema({
    group: {
        type: String,
        index: true,
        default: 'product'
    },
    name: {
        type: String
    },
    slug: {
        type: String,
        index: true
    },
    description: String,
    status: {
        type: String,
        default: 'active'
    },
    ordering: {
        type: Number,
        default: 0
    },
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    collection: 'categories'
});
//# sourceMappingURL=category.schema.js.map