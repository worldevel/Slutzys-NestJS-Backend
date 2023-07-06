"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsModule = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
let UtilsModule = class UtilsModule {
};
UtilsModule = __decorate([
    common_1.Module({
        imports: [
            common_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 5
            })
        ],
        providers: [
            services_1.CountryService,
            services_1.StateService,
            services_1.CityService,
            services_1.LanguageService,
            services_1.PhoneCodeService,
            services_1.UserAdditionalInfoService
        ],
        controllers: [
            controllers_1.CountryController,
            controllers_1.LanguageController,
            controllers_1.PhoneCodeController,
            controllers_1.UserAdditionalInfoController,
            controllers_1.StateController,
            controllers_1.CityController
        ],
        exports: [services_1.CountryService, services_1.LanguageService, services_1.PhoneCodeService]
    })
], UtilsModule);
exports.UtilsModule = UtilsModule;
//# sourceMappingURL=utils.module.js.map