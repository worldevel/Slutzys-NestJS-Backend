"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutRequestDto = void 0;
const lodash_1 = require("lodash");
class PayoutRequestDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'source',
            'sourceId',
            'sourceInfo',
            'paymentAccountType',
            'paymentAccountInfo',
            'requestNote',
            'adminNote',
            'status',
            'sourceType',
            'requestedPrice',
            'fromDate',
            'toDate',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.PayoutRequestDto = PayoutRequestDto;
//# sourceMappingURL=payout-request.dto.js.map