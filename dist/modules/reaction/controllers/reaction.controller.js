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
exports.ReactionController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../../auth/services");
const reaction_service_1 = require("../services/reaction.service");
const payloads_1 = require("../payloads");
const dtos_1 = require("../../user/dtos");
const constants_1 = require("../constants");
let ReactionController = class ReactionController {
    constructor(authService, reactionService) {
        this.authService = authService;
        this.reactionService = reactionService;
    }
    async create(user, payload) {
        const data = await this.reactionService.create(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async remove(user, payload) {
        const data = await this.reactionService.remove(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async favouriteVideos(req, request) {
        const auth = request.authUser && { _id: request.authUser.authId, source: request.authUser.source, sourceId: request.authUser.sourceId };
        const jwToken = request.authUser && this.authService.generateJWT(auth, { expiresIn: 1 * 60 * 60 });
        req.action = constants_1.REACTION.FAVOURITE;
        req.createdBy = request.user._id;
        const data = await this.reactionService.getListVideos(req, request.user, jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async watchLaterVideos(req, request) {
        const auth = request.authUser && { _id: request.authUser.authId, source: request.authUser.source, sourceId: request.authUser.sourceId };
        const jwToken = request.authUser && this.authService.generateJWT(auth, { expiresIn: 1 * 60 * 60 });
        req.action = constants_1.REACTION.WATCH_LATER;
        req.createdBy = request.user._id;
        const data = await this.reactionService.getListVideos(req, request.user, jwToken);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Post(),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, auth_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.ReactionCreatePayload]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "create", null);
__decorate([
    common_1.Delete(),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, auth_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.ReactionCreatePayload]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "remove", null);
__decorate([
    common_1.Get('/videos/favourites'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ReactionSearchRequestPayload, Object]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "favouriteVideos", null);
__decorate([
    common_1.Get('/videos/watch-later'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ReactionSearchRequestPayload, Object]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "watchLaterVideos", null);
ReactionController = __decorate([
    common_1.Injectable(),
    common_1.Controller('reactions'),
    __metadata("design:paramtypes", [services_1.AuthService,
        reaction_service_1.ReactionService])
], ReactionController);
exports.ReactionController = ReactionController;
//# sourceMappingURL=reaction.controller.js.map