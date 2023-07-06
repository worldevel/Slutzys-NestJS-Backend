"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDto = exports.IPaymentResponse = void 0;
const lodash_1 = require("lodash");
const dtos_1 = require("../../coupon/dtos");
class IPaymentResponse {
}
exports.IPaymentResponse = IPaymentResponse;
class PaymentDto {
    constructor(data) {
        data
            && Object.assign(this, lodash_1.pick(data, [
                '_id',
                'paymentGateway',
                'sourceInfo',
                'source',
                'sourceId',
                'performerId',
                'performerInfo',
                'target',
                'targetId',
                'type',
                'products',
                'paymentResponseInfo',
                'status',
                'totalPrice',
                'originalPrice',
                'couponInfo',
                'createdAt',
                'updatedAt',
                'digitalProducts',
                'deliveryAddress'
            ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            paymentGateway: this.paymentGateway,
            sourceId: this.sourceId,
            source: this.source,
            sourceInfo: this.sourceInfo,
            performerId: this.performerId,
            performerInfo: this.performerInfo,
            target: this.target,
            targetId: this.targetId,
            type: this.type,
            products: this.products,
            totalPrice: this.totalPrice,
            originalPrice: this.originalPrice,
            couponInfo: this.couponInfo,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deliveryAddress: this.deliveryAddress
        };
        const privateInfo = {
            paymentResponseInfo: this.paymentResponseInfo
        };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
}
exports.PaymentDto = PaymentDto;
//# sourceMappingURL=payment.dto.js.map