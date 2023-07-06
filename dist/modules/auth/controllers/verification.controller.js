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
exports.VerificationController = void 0;
const auth_service_1 = require("../services/auth.service");
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
let VerificationController = class VerificationController {
    constructor(userService, performerService, authService) {
        this.userService = userService;
        this.performerService = performerService;
        this.authService = authService;
    }
    async resendVerificationEmail(email) {
        let user = await this.userService.findByEmail(email);
        if (!user) {
            user = await this.performerService.findByEmail(email);
        }
        if (!user)
            throw new common_1.HttpException('No account was found, please try again', 404);
        await this.authService.sendVerificationEmail({ email, _id: user._id });
        return kernel_1.DataResponse.ok({ success: true });
    }
};
__decorate([
    common_1.Post('/resend'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "resendVerificationEmail", null);
VerificationController = __decorate([
    common_1.Controller('verification'),
    __metadata("design:paramtypes", [services_1.UserService,
        services_2.PerformerService,
        auth_service_1.AuthService])
], VerificationController);
exports.VerificationController = VerificationController;
//# sourceMappingURL=verification.controller.js.map