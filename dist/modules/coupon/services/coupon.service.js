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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const kernel_1 = require("../../../kernel");
const moment = require("moment");
const providers_1 = require("../../payment/providers");
const models_1 = require("../../payment/models");
const constants_1 = require("../../payment/constants");
const constants_2 = require("../../../kernel/constants");
const dtos_1 = require("../dtos");
const models_2 = require("../models");
const providers_2 = require("../providers");
let CouponService = class CouponService {
    constructor(couponModel, orderModel) {
        this.couponModel = couponModel;
        this.orderModel = orderModel;
    }
    async findByIdOrCode(id) {
        const query = id instanceof mongodb_1.ObjectId || kernel_1.StringHelper.isObjectId(id)
            ? { _id: id }
            : { code: id };
        const coupon = await this.couponModel.findOne(query);
        if (!coupon)
            return null;
        return new dtos_1.CouponDto(coupon);
    }
    async checkExistingCode(code, id) {
        const query = { code };
        if (id) {
            query._id = { $ne: id };
        }
        const count = await this.couponModel.countDocuments(query);
        return count > 0;
    }
    async create(payload) {
        const data = Object.assign(Object.assign({}, payload), { expiredDate: new Date(payload.expiredDate), updatedAt: new Date(), createdAt: new Date() });
        const existedCode = await this.checkExistingCode(payload.code);
        if (existedCode) {
            throw new common_1.ConflictException('Code is duplicated');
        }
        const coupon = await this.couponModel.create(data);
        return new dtos_1.CouponDto(coupon);
    }
    async update(id, payload) {
        const coupon = await this.findByIdOrCode(id);
        if (!coupon) {
            throw new common_1.NotFoundException();
        }
        const existedCode = await this.checkExistingCode(payload.code, id);
        if (existedCode) {
            throw new common_1.ConflictException('Code is duplicated');
        }
        const data = Object.assign(Object.assign({}, payload), { expiredDate: new Date(payload.expiredDate), updatedAt: new Date() });
        return this.couponModel.updateOne({ _id: id }, data);
    }
    async delete(id) {
        const coupon = id instanceof models_2.CouponModel ? id : await this.findByIdOrCode(id);
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        await this.couponModel.deleteOne({ _id: id });
        return true;
    }
    async applyCoupon(code, userId) {
        const coupon = await this.findByIdOrCode(code);
        if (!coupon || coupon.status === constants_2.STATUS.INACTIVE) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        if (moment().isAfter(coupon.expiredDate)) {
            throw new common_1.NotAcceptableException('Coupon is expired');
        }
        if (coupon.numberOfUses <= 0) {
            throw new common_1.NotAcceptableException('Coupon is reached limitation number of uses');
        }
        const usedCoupon = await this.checkUsedCoupon(code, userId);
        if (usedCoupon) {
            throw new common_1.NotAcceptableException('You used this coupon');
        }
        return new dtos_1.CouponDto(coupon);
    }
    async checkUsedCoupon(code, userId) {
        const count = await this.orderModel.countDocuments({
            'couponInfo.code': code,
            buyerId: userId,
            status: constants_1.ORDER_STATUS.PAID
        });
        return count > 0;
    }
    async updateNumberOfUses(couponId) {
        const coupon = await this.couponModel.findById(couponId);
        if (!coupon)
            return;
        if (coupon.numberOfUses === 1) {
            coupon.status = constants_2.STATUS.INACTIVE;
        }
        coupon.numberOfUses -= 1;
        await coupon.save();
    }
};
CouponService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_2.COUPON_PROVIDER)),
    __param(1, common_1.Inject(providers_1.ORDER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], CouponService);
exports.CouponService = CouponService;
//# sourceMappingURL=coupon.service.js.map