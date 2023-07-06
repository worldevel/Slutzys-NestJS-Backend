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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../user/dtos");
const payloads_1 = require("../payloads");
const subscription_service_1 = require("../services/subscription.service");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async create(payload) {
        const data = await this.subscriptionService.adminCreate(payload);
        return kernel_1.DataResponse.ok(data);
    }
    async adminSearch(req) {
        const data = await this.subscriptionService.adminSearch(req);
        return kernel_1.DataResponse.ok(data);
    }
    async performerSearch(req, user) {
        const data = await this.subscriptionService.performerSearch(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async userSearch(req, user) {
        const data = await this.subscriptionService.userSearch(req, user);
        return kernel_1.DataResponse.ok({
            total: data.total,
            data: data.data.map((s) => s.toResponse(false))
        });
    }
    async delete(id) {
        const resp = await this.subscriptionService.delete(id);
        return kernel_1.DataResponse.ok(resp);
    }
};
__decorate([
    common_1.Post(),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.SubscriptionCreatePayload]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "create", null);
__decorate([
    common_1.Get('/admin/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.SubscriptionSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "adminSearch", null);
__decorate([
    common_1.Get('/performer/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.SubscriptionSearchRequestPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "performerSearch", null);
__decorate([
    common_1.Get('/user/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.SubscriptionSearchRequestPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "userSearch", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "delete", null);
SubscriptionController = __decorate([
    common_1.Injectable(),
    common_1.Controller('subscriptions'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionController);
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=subscription.controller.js.map