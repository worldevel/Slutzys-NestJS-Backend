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
exports.AdminCouponController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
let AdminCouponController = class AdminCouponController {
    constructor(couponService, couponSearchService) {
        this.couponService = couponService;
        this.couponSearchService = couponSearchService;
    }
    async create(payload) {
        const coupon = await this.couponService.create(payload);
        return kernel_1.DataResponse.ok(coupon);
    }
    async update(id, currentUser, payload) {
        const coupon = await this.couponService.update(id, payload);
        return kernel_1.DataResponse.ok(coupon);
    }
    async delete(id) {
        const deleted = await this.couponService.delete(id);
        return kernel_1.DataResponse.ok(deleted);
    }
    async search(req) {
        const coupon = await this.couponSearchService.search(req);
        return kernel_1.DataResponse.ok(coupon);
    }
    async details(id) {
        const coupon = await this.couponService.findByIdOrCode(id);
        return kernel_1.DataResponse.ok(coupon);
    }
    async checkApplyCoupon(code, currentUser) {
        const canApply = await this.couponService.applyCoupon(code, currentUser._id);
        return kernel_1.DataResponse.ok(canApply.toResponse(false));
    }
};
__decorate([
    common_1.Post('/admin'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.CouponCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminCouponController.prototype, "create", null);
__decorate([
    common_1.Put('/admin/:id'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, auth_1.CurrentUser()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto,
        payloads_1.CouponUpdatePayload]),
    __metadata("design:returntype", Promise)
], AdminCouponController.prototype, "update", null);
__decorate([
    common_1.Delete('/admin/:id'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCouponController.prototype, "delete", null);
__decorate([
    common_1.Get('/admin/search'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.CouponSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], AdminCouponController.prototype, "search", null);
__decorate([
    common_1.Get('admin/:id/view'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCouponController.prototype, "details", null);
__decorate([
    common_1.Post('/:code/apply-coupon'),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('code')),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminCouponController.prototype, "checkApplyCoupon", null);
AdminCouponController = __decorate([
    common_1.Injectable(),
    common_1.Controller('coupons'),
    __metadata("design:paramtypes", [services_1.CouponService,
        services_1.CouponSearchService])
], AdminCouponController);
exports.AdminCouponController = AdminCouponController;
//# sourceMappingURL=coupon.controller.js.map