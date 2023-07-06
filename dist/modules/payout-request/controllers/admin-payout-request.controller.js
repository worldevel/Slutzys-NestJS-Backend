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
exports.AdminPayoutRequestController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const auth_1 = require("../../auth");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../user/dtos");
const payout_request_service_1 = require("../services/payout-request.service");
const payout_request_payload_1 = require("../payloads/payout-request.payload");
let AdminPayoutRequestController = class AdminPayoutRequestController {
    constructor(payoutRequestService) {
        this.payoutRequestService = payoutRequestService;
    }
    async updateStatus(id, payload) {
        const data = await this.payoutRequestService.adminUpdateStatus(id, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async calculate(payload) {
        const user = { _id: payload.sourceId };
        const data = await this.payoutRequestService.calculateByDate(user, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async stats(payload, user) {
        const data = await this.payoutRequestService.calculateStats(user, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async adminDetails(id) {
        const data = await this.payoutRequestService.adminDetails(id);
        return kernel_1.DataResponse.ok(data);
    }
    async delete(id) {
        const data = await this.payoutRequestService.adminDelete(id);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Post('/status/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payout_request_payload_1.PayoutRequestUpdatePayload]),
    __metadata("design:returntype", Promise)
], AdminPayoutRequestController.prototype, "updateStatus", null);
__decorate([
    common_1.Post('/calculate'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_request_payload_1.PayoutRequestSearchPayload]),
    __metadata("design:returntype", Promise)
], AdminPayoutRequestController.prototype, "calculate", null);
__decorate([
    common_1.Post('/stats'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_request_payload_1.PayoutRequestSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminPayoutRequestController.prototype, "stats", null);
__decorate([
    common_1.Get('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPayoutRequestController.prototype, "adminDetails", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPayoutRequestController.prototype, "delete", null);
AdminPayoutRequestController = __decorate([
    common_1.Injectable(),
    common_1.Controller('payout-requests/admin'),
    __metadata("design:paramtypes", [payout_request_service_1.PayoutRequestService])
], AdminPayoutRequestController);
exports.AdminPayoutRequestController = AdminPayoutRequestController;
//# sourceMappingURL=admin-payout-request.controller.js.map