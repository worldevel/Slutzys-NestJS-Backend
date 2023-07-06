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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdditionalInfoController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const user_additional_info_service_1 = require("../services/user-additional-info.service");
let UserAdditionalInfoController = class UserAdditionalInfoController {
    constructor(userAdditionalInfoService) {
        this.userAdditionalInfoService = userAdditionalInfoService;
    }
    listHeight() {
        return kernel_1.DataResponse.ok(this.userAdditionalInfoService.getBodyInfo());
    }
};
__decorate([
    common_1.Get(''),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserAdditionalInfoController.prototype, "listHeight", null);
UserAdditionalInfoController = __decorate([
    common_1.Injectable(),
    common_1.Controller('user-additional'),
    __metadata("design:paramtypes", [user_additional_info_service_1.UserAdditionalInfoService])
], UserAdditionalInfoController);
exports.UserAdditionalInfoController = UserAdditionalInfoController;
//# sourceMappingURL=user-additional-info.controller.js.map