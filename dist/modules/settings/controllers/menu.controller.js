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
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
let MenuController = class MenuController {
    constructor(menuService) {
        this.menuService = menuService;
    }
    async create(payload) {
        const menu = await this.menuService.create(payload);
        return kernel_1.DataResponse.ok(menu);
    }
    async update(id, payload) {
        const menu = await this.menuService.update(id, payload);
        return kernel_1.DataResponse.ok(menu);
    }
    async delete(id) {
        const deleted = await this.menuService.delete(id);
        return kernel_1.DataResponse.ok(deleted);
    }
    async search(req) {
        const menu = await this.menuService.search(req);
        return kernel_1.DataResponse.ok(menu);
    }
    async userSearch(req) {
        const menu = await this.menuService.userSearch(req);
        return kernel_1.DataResponse.ok(menu);
    }
    async details(id) {
        const menu = await this.menuService.findById(id);
        return kernel_1.DataResponse.ok(menu);
    }
};
__decorate([
    common_1.Post('/admin'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MenuCreatePayload]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "create", null);
__decorate([
    common_1.Put('/admin/:id'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.MenuUpdatePayload]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "update", null);
__decorate([
    common_1.Delete('/admin/:id'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "delete", null);
__decorate([
    common_1.Get('/admin/search'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MenuSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "search", null);
__decorate([
    common_1.Get('/public'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MenuSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "userSearch", null);
__decorate([
    common_1.Get('admin/:id/view'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "details", null);
MenuController = __decorate([
    common_1.Injectable(),
    common_1.Controller('menus'),
    __metadata("design:paramtypes", [services_1.MenuService])
], MenuController);
exports.MenuController = MenuController;
//# sourceMappingURL=menu.controller.js.map