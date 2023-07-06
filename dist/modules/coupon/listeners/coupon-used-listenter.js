"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCouponUsesListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../payment/constants");
const constants_2 = require("../../../kernel/constants");
const coupon_service_1 = require("../services/coupon.service");
const UPDATE_COUPON_USED_TOPIC = 'UPDATE_COUPON_USED_TOPIC';
let UpdateCouponUsesListener = class UpdateCouponUsesListener {
    constructor(queueEventService, couponService) {
        this.queueEventService = queueEventService;
        this.couponService = couponService;
        this.queueEventService.subscribe(constants_1.ORDER_PAID_SUCCESS_CHANNEL, UPDATE_COUPON_USED_TOPIC, this.handleUpdateCoupon.bind(this));
    }
    async handleUpdateCoupon(event) {
        try {
            if (![constants_2.EVENT.CREATED].includes(event.eventName)) {
                return;
            }
            const { order } = event.data;
            if (order.status !== constants_1.ORDER_STATUS.PAID) {
                return;
            }
            if (!order.couponInfo || !order.couponInfo._id) {
                return;
            }
            await this.couponService.updateNumberOfUses(order.couponInfo._id);
        }
        catch (e) {
            console.log('error_coupon_used', e);
        }
    }
};
UpdateCouponUsesListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        coupon_service_1.CouponService])
], UpdateCouponUsesListener);
exports.UpdateCouponUsesListener = UpdateCouponUsesListener;
//# sourceMappingURL=coupon-used-listenter.js.map