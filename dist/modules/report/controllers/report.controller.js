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
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const report_service_1 = require("../services/report.service");
const payloads_1 = require("../payloads");
const dtos_1 = require("../../user/dtos");
let ReportController = class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    async create(user, payload) {
        const data = await this.reportService.create(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async remove(id) {
        const data = await this.reportService.remove(id);
        return kernel_1.DataResponse.ok(data);
    }
    async rejectReport(id) {
        const data = await this.reportService.rejectReport(id);
        return kernel_1.DataResponse.ok(data);
    }
    async adminList(query) {
        const data = await this.reportService.adminSearch(query);
        return kernel_1.DataResponse.ok(data);
    }
    async performerList(query, user) {
        const data = await this.reportService.performerSearch(query, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Post(),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('user'),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, auth_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.ReportCreatePayload]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "create", null);
__decorate([
    common_1.Delete(':id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('admin'),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "remove", null);
__decorate([
    common_1.Put('/:id/reject'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('admin'),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "rejectReport", null);
__decorate([
    common_1.Get(''),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('admin'),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ReportSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "adminList", null);
__decorate([
    common_1.Get('/performers'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('performer'),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ReportSearchRequestPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "performerList", null);
ReportController = __decorate([
    common_1.Injectable(),
    common_1.Controller('reports'),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map