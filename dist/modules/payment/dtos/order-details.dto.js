"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetailsDto = void 0;
const lodash_1 = require("lodash");
class OrderDetailsDto {
    constructor(data) {
        data
            && Object.assign(this, lodash_1.pick(data, [
                '_id',
                'orderId',
                'orderNumber',
                'buyerId',
                'buyerSource',
                'sellerId',
                'sellerSource',
                'productType',
                'productId',
                'name',
                'description',
                'unitPrice',
                'originalPrice',
                'status',
                'payBy',
                'quantity',
                'totalPrice',
                'deliveryStatus',
                'deliveryAddress',
                'paymentStatus',
                'postalCode',
                'phoneNumber',
                'paymentGateway',
                'couponInfo',
                'extraInfo',
                'seller',
                'buyer',
                'createdAt',
                'updatedAt'
            ]));
    }
    toResponse(isAdmin = false) {
        const publicInfo = {
            _id: this._id,
            orderId: this.orderId,
            orderNumber: this.orderNumber,
            buyerId: this.buyerId,
            buyerSource: this.buyerSource,
            sellerId: this.sellerId,
            sellerSource: this.sellerSource,
            productType: this.productType,
            productId: this.productId,
            name: this.name,
            description: this.description,
            unitPrice: this.unitPrice,
            originalPrice: this.originalPrice,
            status: this.status,
            payBy: this.payBy,
            quantity: this.quantity,
            totalPrice: this.totalPrice,
            deliveryStatus: this.deliveryStatus,
            deliveryAddress: this.deliveryAddress,
            paymentStatus: this.paymentStatus,
            postalCode: this.postalCode,
            phoneNumber: this.phoneNumber,
            paymentGateway: this.paymentGateway,
            couponInfo: this.couponInfo,
            seller: this.seller,
            buyer: this.buyer,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
        const privateInfo = {
            extraInfo: this.extraInfo
        };
        if (!isAdmin) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
}
exports.OrderDetailsDto = OrderDetailsDto;
//# sourceMappingURL=order-details.dto.js.map