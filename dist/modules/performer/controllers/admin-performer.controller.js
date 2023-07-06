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
exports.AdminPerformerController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../auth/dtos");
const file_1 = require("../../file");
const constants_1 = require("../../file/constants");
const services_1 = require("../../file/services");
const payloads_1 = require("../payloads");
const services_2 = require("../services");
let AdminPerformerController = class AdminPerformerController {
    constructor(performerService, performerSearchService, authService, fileService) {
        this.performerService = performerService;
        this.performerSearchService = performerSearchService;
        this.authService = authService;
        this.fileService = fileService;
    }
    async search(req) {
        const data = await this.performerSearchService.adminSearch(req);
        return kernel_1.DataResponse.ok({
            total: data.total,
            data: data.data.map((p) => p.toResponse(true))
        });
    }
    async create(currentUser, payload) {
        const { password } = payload;
        delete payload.password;
        const performer = await this.performerService.create(payload, currentUser);
        if (password) {
            performer.email && await this.authService.create(new dtos_2.AuthCreateDto({
                source: 'performer',
                sourceId: performer._id,
                type: 'email',
                key: performer.email.toLowerCase(),
                value: password
            }));
            performer.username && await this.authService.create(new dtos_2.AuthCreateDto({
                source: 'performer',
                sourceId: performer._id,
                type: 'username',
                key: performer.username.toLowerCase().trim(),
                value: password
            }));
        }
        return kernel_1.DataResponse.ok(performer);
    }
    async updateUser(payload, performerId, req) {
        await this.performerService.adminUpdate(performerId, payload);
        const performer = await this.performerService.getDetails(performerId, req.jwToken);
        return kernel_1.DataResponse.ok(performer);
    }
    async getDetails(performerId, req) {
        const performer = await this.performerService.getDetails(performerId, req.jwToken);
        const data = performer.toResponse(true, true);
        return kernel_1.DataResponse.ok(data);
    }
    async uploadPerformerDocument(file, id, req) {
        await this.fileService.addRef(file._id, {
            itemId: id,
            itemType: constants_1.REF_TYPE.PERFORMER
        });
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: `${file.getUrl()}?documentId=${file._id}&token=${req.jwToken}` }));
    }
    async uploadPerformerAvatar(file) {
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async uploadPerformerCover(file) {
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async updatePaymentGatewaySetting(payload) {
        const data = await this.performerService.updatePaymentGateway(payload);
        return kernel_1.DataResponse.ok(data);
    }
    async updateCommissionSetting(performerId, payload) {
        const data = await this.performerService.updateCommissionSetting(performerId, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async updateBankingSetting(performerId, payload, user) {
        const data = await this.performerService.updateBankingSetting(performerId, payload, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Get('/search'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "search", null);
__decorate([
    common_1.Post(),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, auth_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.PerformerCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "create", null);
__decorate([
    common_1.Put('/:id'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('id')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerUpdatePayload, String, Object]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "updateUser", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "getDetails", null);
__decorate([
    common_1.Post('/documents/upload/:performerId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('performer-document', 'file', {
        destination: kernel_1.getConfig('file').documentDir
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, common_1.Param('performerId')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "uploadPerformerDocument", null);
__decorate([
    common_1.Post('/avatar/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('avatar', 'avatar', {
        destination: kernel_1.getConfig('file').avatarDir,
        generateThumbnail: true,
        replaceByThumbnail: true,
        thumbnailSize: kernel_1.getConfig('image').avatar
    })),
    __param(0, file_1.FileUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "uploadPerformerAvatar", null);
__decorate([
    common_1.Post('/cover/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('cover', 'cover', {
        destination: kernel_1.getConfig('file').coverDir
    })),
    __param(0, file_1.FileUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "uploadPerformerCover", null);
__decorate([
    common_1.Put('/:id/payment-gateway-settings'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PaymentGatewaySettingPayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "updatePaymentGatewaySetting", null);
__decorate([
    common_1.Put('/:id/commission-settings'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.CommissionSettingPayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "updateCommissionSetting", null);
__decorate([
    common_1.Put('/:id/banking-settings'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.BankingSettingPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "updateBankingSetting", null);
AdminPerformerController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/performers'),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_2.PerformerSearchService,
        auth_1.AuthService,
        services_1.FileService])
], AdminPerformerController);
exports.AdminPerformerController = AdminPerformerController;
//# sourceMappingURL=admin-performer.controller.js.map