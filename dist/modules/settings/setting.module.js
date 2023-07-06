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
exports.SettingModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const mailer_module_1 = require("../mailer/mailer.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const setting_controller_1 = require("./controllers/setting.controller");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const setting_file_upload_controller_1 = require("./controllers/setting-file-upload.controller");
const file_module_1 = require("../file/file.module");
const admin_setting_controller_1 = require("./controllers/admin-setting.controller");
const menu_controller_1 = require("./controllers/menu.controller");
let SettingModule = class SettingModule {
    constructor(settingService) {
        this.settingService = settingService;
        this.settingService.syncCache();
    }
};
SettingModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.QueueModule.forRoot(),
            kernel_1.MongoDBModule,
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => file_module_1.FileModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule)
        ],
        providers: [
            ...providers_1.settingProviders,
            ...providers_1.menuProviders,
            services_1.SettingService,
            services_1.MenuService
        ],
        controllers: [
            setting_controller_1.SettingController,
            setting_file_upload_controller_1.SettingFileUploadController,
            admin_setting_controller_1.AdminSettingController,
            menu_controller_1.MenuController
        ],
        exports: [...providers_1.settingProviders, ...providers_1.menuProviders, services_1.SettingService, services_1.MenuService]
    }),
    __metadata("design:paramtypes", [services_1.SettingService])
], SettingModule);
exports.SettingModule = SettingModule;
//# sourceMappingURL=setting.module.js.map