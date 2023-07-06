"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CouponSchema = new mongoose_1.Schema({
    name: { type: String },
    description: { type: String },
    code: { type: String, index: true, unique: true },
    value: { type: Number, default: 0 },
    expiredDate: { type: Date },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    numberOfUses: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=coupon.schema.js.map