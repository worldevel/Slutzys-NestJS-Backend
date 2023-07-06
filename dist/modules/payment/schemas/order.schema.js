"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = void 0;
const mongoose_1 = require("mongoose");
exports.OrderSchema = new mongoose_1.Schema({
    buyerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    buyerSource: {
        type: String
    },
    sellerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    sellerSource: {
        type: String
    },
    type: {
        type: String
    },
    orderNumber: {
        type: String
    },
    status: {
        type: String,
        index: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: Number,
        default: 1
    },
    originalPrice: {
        type: Number
    },
    couponInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    deliveryAddress: {
        type: String
    },
    postalCode: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    paymentGateway: {
        type: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=order.schema.js.map