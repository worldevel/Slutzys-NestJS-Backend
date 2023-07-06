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
exports.CityController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const city_service_1 = require("../services/city.service");
let CityController = class CityController {
    constructor(cityService) {
        this.cityService = cityService;
    }
    list(countryCode, state) {
        return kernel_1.DataResponse.ok(this.cityService.getCitiesInState(countryCode, state));
    }
};
__decorate([
    common_1.Get('/:countryCode/:state'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('countryCode')),
    __param(1, common_1.Param('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CityController.prototype, "list", null);
CityController = __decorate([
    common_1.Injectable(),
    common_1.Controller('cities'),
    __metadata("design:paramtypes", [city_service_1.CityService])
], CityController);
exports.CityController = CityController;
//# sourceMappingURL=cities.controller.js.map