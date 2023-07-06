"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const utils_module_1 = require("../utils/utils.module");
const auth_module_1 = require("../auth/auth.module");
const subscription_module_1 = require("../subscription/subscription.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const user_module_1 = require("../user/user.module");
const file_module_1 = require("../file/file.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const listeners_1 = require("./listeners");
const mailer_module_1 = require("../mailer/mailer.module");
const block_module_1 = require("../block/block.module");
let PerformerModule = class PerformerModule {
};
PerformerModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.AgendaModule.register(),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => file_module_1.FileModule),
            common_1.forwardRef(() => subscription_module_1.SubscriptionModule),
            common_1.forwardRef(() => performer_assets_module_1.PerformerAssetsModule),
            common_1.forwardRef(() => utils_module_1.UtilsModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule),
            common_1.forwardRef(() => block_module_1.BlockModule)
        ],
        providers: [
            ...providers_1.performerProviders,
            services_1.PerformerService,
            services_1.PerformerSearchService,
            listeners_1.PerformerAssetsListener,
            listeners_1.PerformerConnectedListener,
            listeners_1.UpdatePerformerStatusListener
        ],
        controllers: [
            controllers_1.AdminPerformerController,
            controllers_1.PerformerController
        ],
        exports: [
            ...providers_1.performerProviders,
            services_1.PerformerService,
            services_1.PerformerSearchService
        ]
    })
], PerformerModule);
exports.PerformerModule = PerformerModule;
//# sourceMappingURL=performer.module.js.map