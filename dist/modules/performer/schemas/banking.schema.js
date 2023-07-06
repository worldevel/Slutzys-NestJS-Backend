"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingSettingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BankingSettingSchema = new mongoose_1.Schema({
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    SSN: {
        type: String
    },
    bankName: {
        type: String
    },
    bankAccount: {
        type: String
    },
    bankRouting: {
        type: String
    },
    bankSwiftCode: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
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
//# sourceMappingURL=banking.schema.js.map