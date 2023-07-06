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
exports.PerformerPhotoController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
const payloads_1 = require("../payloads");
const photo_service_1 = require("../services/photo.service");
const photo_search_service_1 = require("../services/photo-search.service");
const services_1 = require("../../auth/services");
let PerformerPhotoController = class PerformerPhotoController {
    constructor(photoService, photoSearchService, authService) {
        this.photoService = photoService;
        this.photoSearchService = photoSearchService;
        this.authService = authService;
    }
    async upload(files, payload, creator) {
        const resp = await this.photoService.create(files.photo, payload, creator);
        return kernel_1.DataResponse.ok(resp);
    }
    async update(id, payload, updater) {
        const details = await this.photoService.updateInfo(id, payload, updater);
        return kernel_1.DataResponse.ok(details);
    }
    async setCoverGallery(id, updater) {
        const data = await this.photoService.setCoverGallery(id, updater);
        return kernel_1.DataResponse.ok(data);
    }
    async delete(id) {
        const details = await this.photoService.delete(id);
        return kernel_1.DataResponse.ok(details);
    }
    async search(query, user, req) {
        const details = await this.photoSearchService.performerSearch(query, user, req.jwToken);
        return kernel_1.DataResponse.ok(details);
    }
    async details(id) {
        const details = await this.photoService.details(id);
        return kernel_1.DataResponse.ok(details);
    }
    async checkAuth(req) {
        if (!req.query.token)
            throw new kernel_1.ForbiddenException();
        const user = await this.authService.getSourceFromJWT(req.query.token);
        if (!user) {
            throw new kernel_1.ForbiddenException();
        }
        const valid = await this.photoService.checkAuth(req, user);
        return kernel_1.DataResponse.ok(valid);
    }
};
__decorate([
    common_1.Post('/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('performer'),
    common_1.UseInterceptors(file_1.MultiFileUploadInterceptor([
        {
            type: 'performer-photo',
            fieldName: 'photo',
            options: {
                destination: kernel_1.getConfig('file').photoProtectedDir,
                thumbnailSize: {
                    width: 100,
                    height: 100
                }
            }
        }
    ])),
    __param(0, file_1.FilesUploaded()),
    __param(1, common_1.Body()),
    __param(2, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payloads_1.PhotoCreatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerPhotoController.prototype, "upload", null);
__decorate([
    common_1.Put('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('performer'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.PhotoUpdatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerPhotoController.prototype, "update", null);
__decorate([
    common_1.Post('/set-cover/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerPhotoController.prototype, "setCoverGallery", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('performer'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformerPhotoController.prototype, "delete", null);
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('performer'),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PhotoSearchRequest,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], PerformerPhotoController.prototype, "search", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    auth_1.Roles('performer'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformerPhotoController.prototype, "details", null);
__decorate([
    common_1.Get('/auth/check'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerformerPhotoController.prototype, "checkAuth", null);
PerformerPhotoController = __decorate([
    common_1.Injectable(),
    common_1.Controller('performer/performer-assets/photos'),
    __metadata("design:paramtypes", [photo_service_1.PhotoService,
        photo_search_service_1.PhotoSearchService,
        services_1.AuthService])
], PerformerPhotoController);
exports.PerformerPhotoController = PerformerPhotoController;
//# sourceMappingURL=performer-photo.controller.js.map