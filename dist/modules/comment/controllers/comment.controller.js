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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const comment_service_1 = require("../services/comment.service");
const payloads_1 = require("../payloads");
const dtos_1 = require("../../user/dtos");
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    async create(user, payload) {
        const comment = await this.commentService.create(payload, user);
        return kernel_1.DataResponse.ok(comment);
    }
    async update(id, currentUser, payload) {
        const comment = await this.commentService.update(id, payload, currentUser);
        return kernel_1.DataResponse.ok(comment);
    }
    async search(req, currentUser) {
        const comments = await this.commentService.search(req, currentUser);
        return kernel_1.DataResponse.ok(comments);
    }
    async delete(id, currentUser) {
        const data = await this.commentService.delete(id, currentUser);
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
        payloads_1.CommentCreatePayload]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "create", null);
__decorate([
    common_1.Put('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, auth_1.CurrentUser()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto,
        payloads_1.CommentEditPayload]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "update", null);
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.LoadUser),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.CommentSearchRequestPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "search", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "delete", null);
CommentController = __decorate([
    common_1.Injectable(),
    common_1.Controller('comments'),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map