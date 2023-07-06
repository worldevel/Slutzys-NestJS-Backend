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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const constants_1 = require("../../user/constants");
const services_2 = require("../../performer/services");
const constants_2 = require("../../performer/constants");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const payloads_1 = require("../payloads");
const services_3 = require("../services");
const exceptions_1 = require("../exceptions");
let LoginController = class LoginController {
    constructor(performerService, userService, authService) {
        this.performerService = performerService;
        this.userService = userService;
        this.authService = authService;
    }
    async login(req) {
        const query = string_helper_1.isEmail(req.username) ? { email: req.username.toLowerCase() } : { username: req.username };
        const [user, performer] = await Promise.all([
            this.userService.findOne(query),
            this.performerService.findOne(query)
        ]);
        if (!user && !performer) {
            throw new common_1.HttpException('This account is not found. Please sign up', 404);
        }
        const [authUser, authPerformer] = await Promise.all([
            user && this.authService.findBySource({
                source: 'user',
                sourceId: user._id
            }),
            performer && this.authService.findBySource({
                source: 'performer',
                sourceId: performer._id
            })
        ]);
        if (!authUser && !authPerformer) {
            throw new common_1.HttpException('This account is not found. Please sign up', 404);
        }
        const requireEmailVerification = settings_1.SettingService.getValueByKey('requireEmailVerification');
        if ((requireEmailVerification && user && !user.verifiedEmail) || (requireEmailVerification && performer && !performer.verifiedEmail)) {
            throw new exceptions_1.EmailNotVerifiedException();
        }
        if (performer && !performer.verifiedDocument) {
            throw new common_1.HttpException('Please wait for admin to verify your account, or you can contact admin by send message in contact page', 403);
        }
        if ((user && user.status === constants_1.STATUS_INACTIVE) || (performer && performer.status === constants_2.PERFORMER_STATUSES.INACTIVE)) {
            throw new exceptions_1.AccountInactiveException();
        }
        if (authUser && !this.authService.verifyPassword(req.password, authUser)) {
            throw new exceptions_1.PasswordIncorrectException();
        }
        if (authPerformer && !this.authService.verifyPassword(req.password, authPerformer)) {
            throw new exceptions_1.PasswordIncorrectException();
        }
        let token = null;
        if (authUser) {
            token = req.remember ? this.authService.generateJWT(authUser, { expiresIn: 60 * 60 * 24 * 365 }) : this.authService.generateJWT(authUser, { expiresIn: 60 * 60 * 24 * 1 });
        }
        if (!authUser && authPerformer) {
            token = req.remember ? this.authService.generateJWT(authPerformer, { expiresIn: 60 * 60 * 24 * 365 }) : this.authService.generateJWT(authPerformer, { expiresIn: 60 * 60 * 24 * 1 });
        }
        return kernel_1.DataResponse.ok({ token });
    }
};
__decorate([
    common_1.Post('login'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.LoginPayload]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
LoginController = __decorate([
    common_1.Controller('auth'),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.UserService))),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_1.UserService,
        services_3.AuthService])
], LoginController);
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map