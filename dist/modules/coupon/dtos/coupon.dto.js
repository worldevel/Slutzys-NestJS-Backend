"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponDto = void 0;
const lodash_1 = require("lodash");
class CouponDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'name',
            'description',
            'code',
            'value',
            'expiredDate',
            'status',
            'numberOfUses',
            'createdAt',
            'updatedAt'
        ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            code: this.code,
            value: this.value
        };
        const privateInfo = {
            name: this.name,
            expiredDate: this.expiredDate,
            status: this.status,
            numberOfUses: this.numberOfUses,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt
        };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
}
exports.CouponDto = CouponDto;
//# sourceMappingURL=coupon.dto.js.map