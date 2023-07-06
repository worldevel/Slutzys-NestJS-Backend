"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetailsSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants");
exports.OrderDetailsSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    orderNumber: {
        type: String
    },
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
    productType: {
        type: String
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    unitPrice: {
        type: Number
    },
    quantity: {
        type: Number
    },
    originalPrice: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    status: {
        type: String,
        index: true,
        default: constants_1.ORDER_STATUS.CREATED
    },
    deliveryStatus: {
        type: String,
        index: true
    },
    deliveryAddress: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    postalCode: {
        type: String
    },
    paymentGateway: String,
    paymentStatus: {
        type: String,
        index: true,
        default: constants_1.PAYMENT_STATUS.PENDING
    },
    payBy: {
        type: String
    },
    couponInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    shippingCode: {
        type: String
    },
    extraInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=order-details.schema.js.map