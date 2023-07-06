"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_provider_1 = require("./providers/auth.provider");
const user_module_1 = require("../user/user.module");
const services_1 = require("./services");
const mailer_module_1 = require("../mailer/mailer.module");
const guards_1 = require("./guards");
const register_controller_1 = require("./controllers/register.controller");
const login_controller_1 = require("./controllers/login.controller");
const password_controller_1 = require("./controllers/password.controller");
const verification_controller_1 = require("./controllers/verification.controller");
const performer_register_controller_1 = require("./controllers/performer-register.controller");
const file_module_1 = require("../file/file.module");
const performer_module_1 = require("../performer/performer.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule),
            common_1.forwardRef(() => file_module_1.FileModule)
        ],
        providers: [
            ...auth_provider_1.authProviders,
            services_1.AuthService,
            guards_1.AuthGuard,
            guards_1.RoleGuard,
            guards_1.LoadUser
        ],
        controllers: [
            register_controller_1.RegisterController,
            login_controller_1.LoginController,
            password_controller_1.PasswordController,
            performer_register_controller_1.PerformerRegisterController,
            verification_controller_1.VerificationController
        ],
        exports: [
            ...auth_provider_1.authProviders,
            services_1.AuthService,
            guards_1.AuthGuard,
            guards_1.RoleGuard,
            guards_1.LoadUser
        ]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map