"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportProviders = exports.REPORT_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const report_schema_1 = require("../schemas/report.schema");
exports.REPORT_MODEL_PROVIDER = 'REPORT_MODEL_PROVIDER';
exports.reportProviders = [
    {
        provide: exports.REPORT_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Reports', report_schema_1.ReportSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map