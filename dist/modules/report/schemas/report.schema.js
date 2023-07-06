"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = void 0;
const mongoose = require("mongoose");
const constants_1 = require("../constants");
exports.ReportSchema = new mongoose.Schema({
    title: String,
    description: String,
    source: {
        type: String,
        default: 'user',
        index: true
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    performerId: {
        type: mongoose.Schema.Types.ObjectId
    },
    target: {
        type: String,
        default: constants_1.REPORT_TARGET.VIDEO,
        index: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        default: constants_1.REPORT_STATUSES.REPORTED
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
//# sourceMappingURL=report.schema.js.map