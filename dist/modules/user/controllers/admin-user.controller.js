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
exports.AdminUserController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const common_2 = require("../../../kernel/common");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const payloads_1 = require("../payloads");
const dtos_1 = require("../dtos");
const services_1 = require("../services");
let AdminUserController = class AdminUserController {
    constructor(userService, userSearchService, authService) {
        this.userService = userService;
        this.userSearchService = userSearchService;
        this.authService = authService;
    }
    async search(req) {
        return kernel_1.DataResponse.ok(await this.userSearchService.search(req));
    }
    async createUser(payload) {
        const user = await this.userService.create(new payloads_1.UserCreatePayload(payload), {
            roles: payload.roles
        });
        if (payload.password) {
            await Promise.all([
                payload.email && this.authService.create({
                    type: 'email',
                    value: payload.password,
                    source: 'user',
                    key: payload.email,
                    sourceId: user._id
                }),
                payload.username && this.authService.create({
                    type: 'username',
                    value: payload.password,
                    source: 'user',
                    key: payload.username,
                    sourceId: user._id
                })
            ]);
        }
        return kernel_1.DataResponse.ok(new dtos_1.UserDto(user).toResponse(true));
    }
    async updateUser(payload, userId) {
        await this.userService.adminUpdate(userId, payload);
        const user = await this.userService.findById(userId);
        return kernel_1.DataResponse.ok(new dtos_1.UserDto(user).toResponse(true));
    }
    async getDetails(id) {
        const user = await this.userService.findById(id);
        return kernel_1.DataResponse.ok(new dtos_1.UserDto(user).toResponse(true));
    }
};
__decorate([
    common_1.Get('/search'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "search", null);
__decorate([
    common_1.Post('/'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserAuthCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "createUser", null);
__decorate([
    common_1.Put('/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserAuthUpdatePayload, String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "updateUser", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getDetails", null);
AdminUserController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/users'),
    __metadata("design:paramtypes", [services_1.UserService,
        services_1.UserSearchService,
        auth_1.AuthService])
], AdminUserController);
exports.AdminUserController = AdminUserController;
//# sourceMappingURL=admin-user.controller.js.map