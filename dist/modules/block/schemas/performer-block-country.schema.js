"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerBlockCountrySchema = void 0;
const mongoose_1 = require("mongoose");
exports.PerformerBlockCountrySchema = new mongoose_1.Schema({
    source: {
        type: String,
        index: true
    },
    sourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    countryCodes: [{
            _id: false, type: String, index: true
        }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=performer-block-country.schema.js.map