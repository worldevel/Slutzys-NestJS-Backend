"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutRequestSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const constants_1 = require("../constants");
exports.payoutRequestSchema = new mongoose_1.Schema({
    source: {
        index: true,
        type: String,
        default: constants_1.SOURCE_TYPE.PERFORMER
    },
    sourceId: {
        index: true,
        type: mongodb_1.ObjectId
    },
    paymentAccountType: {
        type: String,
        index: true,
        default: 'banking'
    },
    paymentAccountInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    requestNote: {
        type: String
    },
    adminNote: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'rejected', 'done'],
        default: 'pending',
        index: true
    },
    requestedPrice: {
        type: Number,
        default: 0
    },
    fromDate: {
        type: Date
    },
    toDate: {
        type: Date
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=payout-request.schema.js.map