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
exports.PerformerController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const file_1 = require("../../file");
const constants_1 = require("../../file/constants");
const services_1 = require("../../file/services");
const dtos_1 = require("../../user/dtos");
const services_2 = require("../../utils/services");
const constants_2 = require("../constants");
const dtos_2 = require("../dtos");
const payloads_1 = require("../payloads");
const services_3 = require("../services");
let PerformerController = class PerformerController {
    constructor(performerService, performerSearchService, authService, countryService, fileService) {
        this.performerService = performerService;
        this.performerSearchService = performerSearchService;
        this.authService = authService;
        this.countryService = countryService;
        this.fileService = fileService;
    }
    async me(req) {
        const user = await this.performerService.getDetails(req.user._id, req.jwToken);
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(user).toResponse(true, false));
    }
    async usearch(query, req, user) {
        let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ipClient.substr(0, 7) === '::ffff:') {
            ipClient = ipClient.substr(7);
        }
        const whiteListIps = ['127.0.0.1', '0.0.0.1'];
        let countryCode = null;
        if (whiteListIps.indexOf(ipClient) === -1) {
            const userCountry = await this.countryService.findCountryByIP(ipClient);
            if ((userCountry === null || userCountry === void 0 ? void 0 : userCountry.status) === 'success' && (userCountry === null || userCountry === void 0 ? void 0 : userCountry.countryCode)) {
                countryCode = userCountry.countryCode;
            }
        }
        const data = await this.performerSearchService.search(query, user, countryCode);
        return kernel_1.DataResponse.ok(data);
    }
    async updateUser(payload, performerId, req) {
        await this.performerService.selfUpdate(performerId, payload);
        const performer = await this.performerService.getDetails(performerId, req.jwToken);
        if (payload.password) {
            await Promise.all([
                performer.email && this.authService.create({
                    source: 'performer',
                    sourceId: performer._id,
                    type: 'email',
                    key: performer.email,
                    value: payload.password
                }),
                performer.username && this.authService.create({
                    source: 'performer',
                    sourceId: performer._id,
                    type: 'username',
                    key: performer.username,
                    value: payload.password
                })
            ]);
        }
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(performer).toResponse(true, false));
    }
    async getDetails(performerUsername, req, user) {
        let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ipClient.substr(0, 7) === '::ffff:') {
            ipClient = ipClient.substr(7);
        }
        const whiteListIps = ['127.0.0.1', '0.0.0.1'];
        let countryCode = null;
        if (whiteListIps.indexOf(ipClient) === -1) {
            const userCountry = await this.countryService.findCountryByIP(ipClient);
            if ((userCountry === null || userCountry === void 0 ? void 0 : userCountry.status) === 'success' && (userCountry === null || userCountry === void 0 ? void 0 : userCountry.countryCode)) {
                countryCode = userCountry.countryCode;
            }
        }
        const performer = await this.performerService.findByUsername(performerUsername, countryCode, user);
        if (!performer || performer.status !== constants_2.PERFORMER_STATUSES.ACTIVE) {
            throw new common_1.HttpException('This account is suspended', 422);
        }
        return kernel_1.DataResponse.ok(performer.toPublicDetailsResponse());
    }
    async uploadPerformerDocument(currentUser, file, req) {
        await this.fileService.addRef(file._id, {
            itemId: currentUser._id,
            itemType: constants_1.REF_TYPE.PERFORMER
        });
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: `${file.getUrl()}?documentId=${file._id}&token=${req.jwToken}` }));
    }
    async updatePaymentGatewaySetting(payload) {
        const data = await this.performerService.updatePaymentGateway(payload);
        return kernel_1.DataResponse.ok(data);
    }
    async uploadPerformerAvatar(file, performer) {
        await this.performerService.updateAvatar(performer, file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async uploadPerformerCover(file, performer) {
        await this.performerService.updateCover(performer, file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async uploadPerformerVideo(file, performer) {
        await this.performerService.updateWelcomeVideo(performer, file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async updateBankingSetting(performerId, payload, user) {
        const data = await this.performerService.updateBankingSetting(performerId, payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async checkAuth(req) {
        if (!req.query.token)
            throw new kernel_1.ForbiddenException();
        const user = await this.authService.getSourceFromJWT(req.query.token);
        if (!user) {
            throw new kernel_1.ForbiddenException();
        }
        const valid = await this.performerService.checkAuthDocument(req, user);
        return kernel_1.DataResponse.ok(valid);
    }
};
__decorate([
    common_1.Get('/me'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "me", null);
__decorate([
    common_1.Get('/search'),
    common_1.UseGuards(guards_1.LoadUser),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Request()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload, Object, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "usearch", null);
__decorate([
    common_1.Put('/:id'),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('id')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.SelfUpdatePayload, String, Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updateUser", null);
__decorate([
    common_1.Get('/:username'),
    common_1.UseGuards(guards_1.LoadUser),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('username')),
    __param(1, common_1.Request()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "getDetails", null);
__decorate([
    common_1.Post('/documents/upload'),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('performer-document', 'file', {
        destination: kernel_1.getConfig('file').documentDir
    })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, file_1.FileUploaded()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        file_1.FileDto, Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerDocument", null);
__decorate([
    common_1.Put('/:id/payment-gateway-settings'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PaymentGatewaySettingPayload]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updatePaymentGatewaySetting", null);
__decorate([
    common_1.Post('/avatar/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('avatar', 'avatar', {
        destination: kernel_1.getConfig('file').avatarDir,
        generateThumbnail: true,
        replaceByThumbnail: true,
        thumbnailSize: kernel_1.getConfig('image').avatar
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_2.PerformerDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerAvatar", null);
__decorate([
    common_1.Post('/cover/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('cover', 'cover', {
        destination: kernel_1.getConfig('file').coverDir,
        generateThumbnail: true,
        thumbnailSize: kernel_1.getConfig('image').coverThumbnail
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_2.PerformerDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerCover", null);
__decorate([
    common_1.Post('/welcome-video/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('performer-welcome-video', 'welcome-video', {
        destination: kernel_1.getConfig('file').videoDir
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_2.PerformerDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerVideo", null);
__decorate([
    common_1.Put('/:id/banking-settings'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.BankingSettingPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updateBankingSetting", null);
__decorate([
    common_1.Get('/documents/auth/check'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "checkAuth", null);
PerformerController = __decorate([
    common_1.Injectable(),
    common_1.Controller('performers'),
    __metadata("design:paramtypes", [services_3.PerformerService,
        services_3.PerformerSearchService,
        auth_1.AuthService,
        services_2.CountryService,
        services_1.FileService])
], PerformerController);
exports.PerformerController = PerformerController;
//# sourceMappingURL=performer.controller.js.map