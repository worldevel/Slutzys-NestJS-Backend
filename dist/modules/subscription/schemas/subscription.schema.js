"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionSchema = void 0;
const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({
    subscriptionType: {
        type: String,
        default: 'monthly',
        index: true,
        enum: ['monthly', 'yearly', 'system']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    performerId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    subscriptionId: {
        type: String,
        index: true
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    paymentGateway: {
        type: String,
        index: true
    },
    startRecurringDate: {
        type: Date,
        default: Date.now
    },
    nextRecurringDate: {
        type: Date
    },
    status: {
        type: String,
        default: 'active',
        index: true
    },
    meta: {
        type: mongoose.Schema.Types.Mixed
    },
    expiredAt: {
        type: Date,
        default: Date.now
    },
    blockedUser: {
        type: Boolean,
        default: false
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
subscriptionSchema.pre('save', function preSave(next) {
    this.updatedAt = new Date();
    next(null);
});
subscriptionSchema.pre('updateOne', function preUpdateOne(next) {
    this.updatedAt = new Date();
    next(null);
});
exports.SubscriptionSchema = subscriptionSchema;
//# sourceMappingURL=subscription.schema.js.map