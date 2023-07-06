"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockCountrySchema = void 0;
const mongoose = require("mongoose");
exports.BlockCountrySchema = new mongoose.Schema({
    countryCode: {
        _id: false, type: String, index: true, unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=site-block-countries.schema.js.map