"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningDto = void 0;
const lodash_1 = require("lodash");
class EarningDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'userId',
            'userInfo',
            'transactionId',
            'transactionInfo',
            'performerId',
            'performerInfo',
            'sourceType',
            'grossPrice',
            'netPrice',
            'isPaid',
            'commission',
            'createdAt',
            'paidAt',
            'transactionStatus',
            'order'
        ]));
    }
}
exports.EarningDto = EarningDto;
//# sourceMappingURL=earning.dto.js.map