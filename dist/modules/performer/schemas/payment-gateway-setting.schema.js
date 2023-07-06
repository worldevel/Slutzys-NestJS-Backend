"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewaySettingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PaymentGatewaySettingSchema = new mongoose_1.Schema({
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    key: String,
    value: mongoose_1.Schema.Types.Mixed,
    status: {
        type: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=payment-gateway-setting.schema.js.map