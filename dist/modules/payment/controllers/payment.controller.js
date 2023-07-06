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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const payloads_1 = require("../payloads");
const dtos_1 = require("../../user/dtos");
const payment_service_1 = require("../services/payment.service");
const services_1 = require("../services");
let PaymentController = class PaymentController {
    constructor(orderService, paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }
    async create(user, payload) {
        const order = await this.orderService.createForPerformerSubscription(payload, user);
        const info = await this.paymentService.subscribePerformer(order, payload.paymentGateway || 'ccbill');
        return kernel_1.DataResponse.ok(info);
    }
    async purchaseVideo(user, payload) {
        const order = await this.orderService.createFromPerformerVOD(payload, user);
        const info = await this.paymentService.purchasePerformerVOD(order, payload.paymentGateway || 'ccbill');
        return kernel_1.DataResponse.ok(info);
    }
    async purchaseProducts(user, payload) {
        const order = await this.orderService.createFromPerformerProducts(payload, user);
        const info = await this.paymentService.purchasePerformerProducts(order, payload.paymentGateway || 'ccbill');
        return kernel_1.DataResponse.ok(info);
    }
};
__decorate([
    common_1.Post('/subscribe/performers'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, auth_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.SubscribePerformerPayload]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    common_1.Post('/purchase-video'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, auth_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.PurchaseVideoPayload]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "purchaseVideo", null);
__decorate([
    common_1.Post('/purchase-products'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, auth_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.PurchaseProductsPayload]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "purchaseProducts", null);
PaymentController = __decorate([
    common_1.Injectable(),
    common_1.Controller('payment'),
    __metadata("design:paramtypes", [services_1.OrderService,
        payment_service_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map