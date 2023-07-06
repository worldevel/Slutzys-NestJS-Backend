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
exports.UserGalleryController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const auth_1 = require("../../auth");
const payloads_1 = require("../payloads");
const gallery_service_1 = require("../services/gallery.service");
let UserGalleryController = class UserGalleryController {
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    async searchGallery(req, user) {
        const resp = await this.galleryService.userSearch(req, user);
        return kernel_1.DataResponse.ok(resp);
    }
    async view(id, user) {
        const resp = await this.galleryService.details(id, user);
        return kernel_1.DataResponse.ok(resp);
    }
    async download(res, id, user) {
        const resp = await this.galleryService.downloadZipPhotos(id, user);
        return kernel_1.DataResponse.ok(resp);
    }
};
__decorate([
    common_1.Get('/search'),
    common_1.UseGuards(guards_1.LoadUser),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.GallerySearchRequest, Object]),
    __metadata("design:returntype", Promise)
], UserGalleryController.prototype, "searchGallery", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.UseGuards(guards_1.LoadUser),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserGalleryController.prototype, "view", null);
__decorate([
    common_1.Post('/:id/download-zip'),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Res()),
    __param(1, common_1.Param('id')),
    __param(2, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UserGalleryController.prototype, "download", null);
UserGalleryController = __decorate([
    common_1.Injectable(),
    common_1.Controller('user/performer-assets/galleries'),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], UserGalleryController);
exports.UserGalleryController = UserGalleryController;
//# sourceMappingURL=user-gallery.controller.js.map