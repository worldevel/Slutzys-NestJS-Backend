"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDto = void 0;
const lodash_1 = require("lodash");
class OrderDto {
    constructor(data) {
        data
            && Object.assign(this, lodash_1.pick(data, [
                '_id',
                'buyerId',
                'buyerSource',
                'sellerId',
                'sellerSource',
                'type',
                'quantity',
                'totalPrice',
                'originalPrice',
                'deliveryAddress',
                'postalCode',
                'phoneNumber',
                'paymentGateway',
                'couponInfo',
                'buyer',
                'seller',
                'status',
                'details',
                'orderNumber',
                'createdAt',
                'updatedAt'
            ]));
    }
}
exports.OrderDto = OrderDto;
//# sourceMappingURL=order.dto.js.map