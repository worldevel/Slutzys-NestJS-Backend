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
exports.PerformerBlockController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const payloads_1 = require("../payloads");
const services_1 = require("../services");
let PerformerBlockController = class PerformerBlockController {
    constructor(performerBlockService) {
        this.performerBlockService = performerBlockService;
    }
    async performerBlockCountries(payload, user) {
        const data = await this.performerBlockService.performerBlockCountries(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async blockUser(performer, payload) {
        const data = await this.performerBlockService.blockUser(performer, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async unblockUser(userId, performer) {
        const data = await this.performerBlockService.unblockUser(performer, userId);
        return kernel_1.DataResponse.ok(data);
    }
    async search(performer, payload) {
        const blocked = await this.performerBlockService.getBlockedUsers(performer, payload);
        return kernel_1.DataResponse.ok(blocked);
    }
};
__decorate([
    common_1.Post('/countries'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    decorators_1.Roles('performer'),
    __param(0, common_1.Body()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerBlockCountriesPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerBlockController.prototype, "performerBlockCountries", null);
__decorate([
    common_1.Post('/user'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    decorators_1.Roles('performer'),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.PerformerBlockUserPayload]),
    __metadata("design:returntype", Promise)
], PerformerBlockController.prototype, "blockUser", null);
__decorate([
    common_1.Delete('/user/:userId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    decorators_1.Roles('performer'),
    __param(0, common_1.Param('userId')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerBlockController.prototype, "unblockUser", null);
__decorate([
    common_1.Get('/users'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    decorators_1.Roles('performer'),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.GetBlockListUserPayload]),
    __metadata("design:returntype", Promise)
], PerformerBlockController.prototype, "search", null);
PerformerBlockController = __decorate([
    common_1.Injectable(),
    common_1.Controller('performer-blocks'),
    __metadata("design:paramtypes", [services_1.PerformerBlockService])
], PerformerBlockController);
exports.PerformerBlockController = PerformerBlockController;
//# sourceMappingURL=peformer-block.controller.js.map