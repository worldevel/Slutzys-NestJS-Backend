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
exports.RegisterController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const kernel_1 = require("../../../kernel");
const payloads_1 = require("../../user/payloads");
const settings_1 = require("../../settings");
const constants_1 = require("../../user/constants");
const dtos_1 = require("../dtos");
const payloads_2 = require("../payloads");
const services_2 = require("../services");
let RegisterController = class RegisterController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async userRegister(req) {
        const requireEmailVerification = settings_1.SettingService.getValueByKey('requireEmailVerification');
        const user = await this.userService.create(new payloads_1.UserCreatePayload(req), {
            status: requireEmailVerification
                ? constants_1.STATUS_PENDING_EMAIL_CONFIRMATION
                : constants_1.STATUS_ACTIVE,
            roles: constants_1.ROLE_USER
        });
        await Promise.all([
            req.email && this.authService.create(new dtos_1.AuthCreateDto({
                source: 'user',
                sourceId: user._id,
                type: 'email',
                value: req.password,
                key: req.email
            })),
            req.username && this.authService.create(new dtos_1.AuthCreateDto({
                source: 'user',
                sourceId: user._id,
                type: 'username',
                value: req.password,
                key: req.username
            }))
        ]);
        requireEmailVerification && user.email && await this.authService.sendVerificationEmail({
            _id: user._id,
            email: user.email
        });
        return kernel_1.DataResponse.ok({
            message: requireEmailVerification ? 'Please verify your account using the verification email sent to you.' : 'You have successfully registered.'
        });
    }
    async verifyEmail(res, token) {
        if (!token) {
            return res.render('404.html');
        }
        await this.authService.verifyEmail(token);
        if (process.env.EMAIL_VERIFIED_SUCCESS_URL) {
            return res.redirect(process.env.EMAIL_VERIFIED_SUCCESS_URL);
        }
        return res.redirect(`${process.env.BASE_URL}/auth/login`);
    }
};
__decorate([
    common_1.Post('users/register'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_2.UserRegisterPayload]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "userRegister", null);
__decorate([
    common_1.Get('email-verification'),
    __param(0, common_1.Res()),
    __param(1, common_1.Query('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "verifyEmail", null);
RegisterController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [services_1.UserService,
        services_2.AuthService])
], RegisterController);
exports.RegisterController = RegisterController;
//# sourceMappingURL=register.controller.js.map