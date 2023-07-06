"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportDto = void 0;
const lodash_1 = require("lodash");
class ReportDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'title',
            'description',
            'source',
            'sourceId',
            'sourceInfo',
            'performerId',
            'performerInfo',
            'target',
            'targetId',
            'targetInfo',
            'status',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.ReportDto = ReportDto;
//# sourceMappingURL=report.dto.js.map