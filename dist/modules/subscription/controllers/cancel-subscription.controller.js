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
exports.CancelSubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../user/dtos");
const subscription_service_1 = require("../services/subscription.service");
const cancel_subscription_service_1 = require("../services/cancel-subscription.service");
let CancelSubscriptionController = class CancelSubscriptionController {
    constructor(subscriptionService, cancelSubscriptionService) {
        this.subscriptionService = subscriptionService;
        this.cancelSubscriptionService = cancelSubscriptionService;
    }
    async adminCancel(id) {
        const data = await this.cancelSubscriptionService.cancelSubscription(id);
        return kernel_1.DataResponse.ok(data);
    }
    async userCancel(id, user) {
        const subscription = await this.subscriptionService.findById(id);
        if (!subscription)
            throw new kernel_1.EntityNotFoundException();
        if (subscription.userId.toString() !== user._id.toString())
            throw new kernel_1.ForbiddenException();
        const data = await this.cancelSubscriptionService.cancelSubscription(id);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Post('/admin/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancelSubscriptionController.prototype, "adminCancel", null);
__decorate([
    common_1.Post('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], CancelSubscriptionController.prototype, "userCancel", null);
CancelSubscriptionController = __decorate([
    common_1.Injectable(),
    common_1.Controller('subscriptions/cancel'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        cancel_subscription_service_1.CancelSubscriptionService])
], CancelSubscriptionController);
exports.CancelSubscriptionController = CancelSubscriptionController;
//# sourceMappingURL=cancel-subscription.controller.js.map