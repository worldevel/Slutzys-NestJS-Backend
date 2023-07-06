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
exports.AdminCategoryController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../services");
const category_update_payload_1 = require("../payloads/category-update.payload");
const category_create_payload_1 = require("../payloads/category-create.payload");
const category_search_request_1 = require("../payloads/category-search.request");
let AdminCategoryController = class AdminCategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async createProductCategory(payload, creator) {
        const resp = await this.categoryService.create(payload, creator);
        return kernel_1.DataResponse.ok(resp);
    }
    async updateGallery(id, payload, creator) {
        const resp = await this.categoryService.update(id, payload, creator);
        return kernel_1.DataResponse.ok(resp);
    }
    async searchCategory(req) {
        const resp = await this.categoryService.search(req);
        return kernel_1.DataResponse.ok(resp);
    }
    async view(id) {
        const resp = await this.categoryService.findByIdOrAlias(id);
        return kernel_1.DataResponse.ok(resp);
    }
    async delete(id) {
        const details = await this.categoryService.delete(id);
        return kernel_1.DataResponse.ok(details);
    }
};
__decorate([
    common_1.Post(''),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_create_payload_1.CategoryCreatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "createProductCategory", null);
__decorate([
    common_1.Put('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, category_update_payload_1.CategoryUpdatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "updateGallery", null);
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_search_request_1.CategorySearchRequest]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "searchCategory", null);
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
], AdminCategoryController.prototype, "view", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "delete", null);
AdminCategoryController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/categories'),
    __metadata("design:paramtypes", [services_1.CategoryService])
], AdminCategoryController);
exports.AdminCategoryController = AdminCategoryController;
//# sourceMappingURL=admin-category.controller.js.map