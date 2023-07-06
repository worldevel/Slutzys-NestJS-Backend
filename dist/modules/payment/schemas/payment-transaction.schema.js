"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTransactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PaymentTransactionSchema = new mongoose_1.Schema({
    paymentGateway: {
        type: String
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    source: {
        type: String,
        index: true
    },
    sourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    type: {
        type: String,
        index: true
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    paymentResponseInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    paymentToken: {
        type: String
    },
    status: {
        type: String,
        index: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=payment-transaction.schema.js.map