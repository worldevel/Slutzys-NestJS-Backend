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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../utils/services");
const payloads_1 = require("../payloads");
const search_service_1 = require("../services/search.service");
let SearchController = class SearchController {
    constructor(searchService, countryService) {
        this.searchService = searchService;
        this.countryService = countryService;
    }
    async list(query, req) {
        let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ipClient.substr(0, 7) === '::ffff:') {
            ipClient = ipClient.substr(7);
        }
        const whiteListIps = ['127.0.0.1', '0.0.0.1'];
        let countryCode = null;
        if (whiteListIps.indexOf(ipClient) === -1) {
            const userCountry = await this.countryService.findCountryByIP(ipClient);
            if ((userCountry === null || userCountry === void 0 ? void 0 : userCountry.status) === 'success' && (userCountry === null || userCountry === void 0 ? void 0 : userCountry.countryCode)) {
                countryCode = userCountry.countryCode;
            }
        }
        const stats = await this.searchService.countTotal(query, countryCode);
        return kernel_1.DataResponse.ok(stats);
    }
};
__decorate([
    common_1.Get('/total'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Query()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.SearchPayload, Object]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "list", null);
SearchController = __decorate([
    common_1.Injectable(),
    common_1.Controller('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService,
        services_1.CountryService])
], SearchController);
exports.SearchController = SearchController;
//# sourceMappingURL=search.controller.js.map