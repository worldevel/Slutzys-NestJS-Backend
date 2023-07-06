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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async ordersDetails(req, user) {
        if (user.isPerformer)
            req.sellerId = user._id;
        const data = await this.orderService.orderDetailsSearch(req);
        return kernel_1.DataResponse.ok(data);
    }
    async orders(req, user) {
        if (user.isPerformer)
            req.sellerId = user._id;
        const data = await this.orderService.search(req);
        return kernel_1.DataResponse.ok(data);
    }
    async userDetailsOrders(req, user) {
        req.buyerId = user._id;
        const data = await this.orderService.orderDetailsSearch(req);
        return kernel_1.DataResponse.ok(data);
    }
    async userOrders(req, user) {
        req.buyerId = user._id;
        const data = await this.orderService.search(req);
        return kernel_1.DataResponse.ok(data);
    }
    async update(id, payload, user) {
        const data = await this.orderService.updateDetails(id, payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async details(id) {
        const data = await this.orderService.getOrderDetails(id);
        return kernel_1.DataResponse.ok(data);
    }
    async details2(id) {
        const data = await this.orderService.getOrderDetails(id);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Get('/details/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer', 'admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.OrderSearchPayload, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "ordersDetails", null);
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer', 'admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.OrderSearchPayload, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "orders", null);
__decorate([
    common_1.Get('/users/details/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.OrderSearchPayload, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "userDetailsOrders", null);
__decorate([
    common_1.Get('/users/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.OrderSearchPayload, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "userOrders", null);
__decorate([
    common_1.Put('/:id/update'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer', 'admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.OrderUpdatePayload, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
__decorate([
    common_1.Get('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "details", null);
__decorate([
    common_1.Get('/details/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "details2", null);
OrderController = __decorate([
    common_1.Injectable(),
    common_1.Controller('orders'),
    __metadata("design:paramtypes", [services_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map