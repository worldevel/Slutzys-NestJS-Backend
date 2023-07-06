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
exports.SiteBlockCountryController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../services");
const site_block_country_payload_1 = require("../payloads/site-block-country.payload");
let SiteBlockCountryController = class SiteBlockCountryController {
    constructor(blockCountryService) {
        this.blockCountryService = blockCountryService;
    }
    async search() {
        const search = await this.blockCountryService.search();
        return kernel_1.DataResponse.ok(search);
    }
    async createUser(payload) {
        const resp = await this.blockCountryService.create(payload);
        return kernel_1.DataResponse.ok(resp);
    }
    async delete(countryCode) {
        const deleted = await this.blockCountryService.delete(countryCode);
        return kernel_1.DataResponse.ok(deleted);
    }
};
__decorate([
    common_1.Get('/search'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiteBlockCountryController.prototype, "search", null);
__decorate([
    common_1.Post('/'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [site_block_country_payload_1.BlockCountryCreatePayload]),
    __metadata("design:returntype", Promise)
], SiteBlockCountryController.prototype, "createUser", null);
__decorate([
    common_1.Delete('/:code'),
    auth_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiteBlockCountryController.prototype, "delete", null);
SiteBlockCountryController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/block/countries'),
    __metadata("design:paramtypes", [services_1.SiteBlockCountryService])
], SiteBlockCountryController);
exports.SiteBlockCountryController = SiteBlockCountryController;
//# sourceMappingURL=admin-block-country.controller.js.map