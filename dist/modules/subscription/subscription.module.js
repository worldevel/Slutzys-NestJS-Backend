"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const subscription_controller_1 = require("./controllers/subscription.controller");
const cancel_subscription_controller_1 = require("./controllers/cancel-subscription.controller");
const subscription_service_1 = require("./services/subscription.service");
const subscription_provider_1 = require("./providers/subscription.provider");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const order_subscription_update_listener_1 = require("./listeners/order-subscription-update.listener");
const cancel_subscription_service_1 = require("./services/cancel-subscription.service");
const setting_module_1 = require("../settings/setting.module");
const mailer_module_1 = require("../mailer/mailer.module");
const payment_module_1 = require("../payment/payment.module");
let SubscriptionModule = class SubscriptionModule {
};
SubscriptionModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.QueueModule.forRoot(),
            kernel_1.MongoDBModule,
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => setting_module_1.SettingModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule),
            common_1.forwardRef(() => payment_module_1.PaymentModule)
        ],
        providers: [...subscription_provider_1.subscriptionProviders, subscription_service_1.SubscriptionService, cancel_subscription_service_1.CancelSubscriptionService, order_subscription_update_listener_1.OrderSubscriptionListener],
        controllers: [subscription_controller_1.SubscriptionController, cancel_subscription_controller_1.CancelSubscriptionController],
        exports: [...subscription_provider_1.subscriptionProviders, subscription_service_1.SubscriptionService, cancel_subscription_service_1.CancelSubscriptionService]
    })
], SubscriptionModule);
exports.SubscriptionModule = SubscriptionModule;
//# sourceMappingURL=subscription.module.js.map