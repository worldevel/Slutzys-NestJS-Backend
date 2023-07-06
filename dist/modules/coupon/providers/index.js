"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponProviders = exports.COUPON_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.COUPON_PROVIDER = 'COUPON_PROVIDER';
exports.couponProviders = [
    {
        provide: exports.COUPON_PROVIDER,
        useFactory: (connection) => connection.model('Coupon', schemas_1.CouponSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map