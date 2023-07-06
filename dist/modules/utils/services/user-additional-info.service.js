"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdditionalInfoService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
let UserAdditionalInfoService = class UserAdditionalInfoService {
    getBodyInfo() {
        if (this.info)
            return this.info;
        this.info = {
            heights: constants_1.HEIGHTS,
            weights: constants_1.WEIGHTS,
            ages: constants_1.AGES,
            butts: constants_1.BUTTS,
            eyes: constants_1.EYES,
            ethnicities: constants_1.ETHNICITIES,
            genders: constants_1.GENDERS,
            hairs: constants_1.HAIRS,
            pubicHairs: constants_1.PUBIC_HAIRS,
            bodyTypes: constants_1.BODY_TYPES,
            sexualOrientations: constants_1.SEXUAL_ORIENTATIONS
        };
        return this.info;
    }
};
UserAdditionalInfoService = __decorate([
    common_1.Injectable()
], UserAdditionalInfoService);
exports.UserAdditionalInfoService = UserAdditionalInfoService;
//# sourceMappingURL=user-additional-info.service.js.map