"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionSettingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CommissionSettingSchema = new mongoose_1.Schema({
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    monthlySubscriptionCommission: { type: Number, default: 0.1 },
    yearlySubscriptionCommission: { type: Number, default: 0.1 },
    videoSaleCommission: { type: Number, default: 0.1 },
    productSaleCommission: { type: Number, default: 0.1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=commission-schema.js.map