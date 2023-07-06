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
exports.UserPhotosController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const auth_1 = require("../../auth");
const guards_1 = require("../../auth/guards");
const dtos_1 = require("../../user/dtos");
const photo_service_1 = require("../services/photo.service");
const photo_search_service_1 = require("../services/photo-search.service");
const payloads_1 = require("../payloads");
const services_1 = require("../../auth/services");
let UserPhotosController = class UserPhotosController {
    constructor(photoService, photoSearchService, authService) {
        this.photoService = photoService;
        this.photoSearchService = photoSearchService;
        this.authService = authService;
    }
    async search(query, req) {
        query.status = constants_1.STATUS.ACTIVE;
        const auth = req.authUser && { _id: req.authUser.authId, source: req.authUser.source, sourceId: req.authUser.sourceId };
        const jwToken = auth && this.authService.generateJWT(auth, { expiresIn: 4 * 60 * 60 });
        const data = await this.photoSearchService.searchPhotos(query, jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async list(query, req) {
        const auth = req.authUser && { _id: req.authUser.authId, source: req.authUser.source, sourceId: req.authUser.sourceId };
        const jwToken = auth && this.authService.generateJWT(auth, { expiresIn: 1 * 60 * 60 });
        const data = await this.photoSearchService.getModelPhotosWithGalleryCheck(query, jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async details(id, user) {
        const details = await this.photoService.details(id, user);
        return kernel_1.DataResponse.ok(details);
    }
};
__decorate([
    common_1.Get('/'),
    common_1.UseGuards(guards_1.LoadUser),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Query()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PhotoSearchRequest, Object]),
    __metadata("design:returntype", Promise)
], UserPhotosController.prototype, "search", null);
__decorate([
    common_1.Get(),
    common_1.UseGuards(guards_1.LoadUser),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Query()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PhotoSearchRequest, Object]),
    __metadata("design:returntype", Promise)
], UserPhotosController.prototype, "list", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.UseGuards(guards_1.LoadUser),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('id')), __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserPhotosController.prototype, "details", null);
UserPhotosController = __decorate([
    common_1.Injectable(),
    common_1.Controller('user/performer-assets/photos'),
    __metadata("design:paramtypes", [photo_service_1.PhotoService,
        photo_search_service_1.PhotoSearchService,
        services_1.AuthService])
], UserPhotosController);
exports.UserPhotosController = UserPhotosController;
//# sourceMappingURL=user-photo.controller.js.map