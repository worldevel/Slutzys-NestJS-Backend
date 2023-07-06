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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("./kernel");
const services_1 = require("./modules/block/services");
const services_2 = require("./modules/utils/services");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService, blockCountryService, countryService) {
        this.appService = appService;
        this.blockCountryService = blockCountryService;
        this.countryService = countryService;
    }
    async blockCountry(req) {
        let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ipClient.substr(0, 7) === '::ffff:') {
            ipClient = ipClient.substr(7);
        }
        const whiteListIps = ['127.0.0.1', '0.0.0.1', '::1'];
        if (whiteListIps.indexOf(ipClient) === -1) {
            try {
                const userCountry = await this.countryService.findCountryByIP(ipClient);
                if (userCountry && userCountry.status === 'success' && userCountry.countryCode) {
                    const check = await this.blockCountryService.checkCountryBlock(userCountry.countryCode);
                    return kernel_1.DataResponse.ok(check);
                }
            }
            catch (e) {
                return kernel_1.DataResponse.ok({ blocked: false });
            }
        }
        return kernel_1.DataResponse.ok({ blocked: false });
    }
    getHello() {
        return this.appService.getHello();
    }
};
__decorate([
    common_1.Get('/country-block/check'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "blockCountry", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        services_1.SiteBlockCountryService,
        services_2.CountryService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map