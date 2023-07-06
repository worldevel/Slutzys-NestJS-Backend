"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const kernel_1 = require("../../kernel");
const common_1 = require("@nestjs/common");
const coupon_module_1 = require("../coupon/coupon.module");
const request_log_middleware_1 = require("../../kernel/logger/request-log.middleware");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const performer_module_1 = require("../performer/performer.module");
const subscription_module_1 = require("../subscription/subscription.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const providers_1 = require("./providers");
const setting_module_1 = require("../settings/setting.module");
const mailer_module_1 = require("../mailer/mailer.module");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const listeners_1 = require("./listeners");
const verotel_service_1 = require("./services/verotel.service");
let PaymentModule = class PaymentModule {
    configure(consumer) {
        consumer
            .apply(request_log_middleware_1.RequestLoggerMiddleware)
            .forRoutes('/payment/*/callhook');
    }
};
PaymentModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5
            }),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => setting_module_1.SettingModule),
            common_1.forwardRef(() => subscription_module_1.SubscriptionModule),
            common_1.forwardRef(() => performer_assets_module_1.PerformerAssetsModule),
            common_1.forwardRef(() => coupon_module_1.CouponModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule)
        ],
        providers: [
            ...providers_1.paymentProviders,
            ...providers_1.orderProviders,
            services_1.PaymentService,
            services_1.CCBillService,
            services_1.CheckPaymentService,
            services_1.OrderService,
            listeners_1.OrderListener,
            verotel_service_1.VerotelService
        ],
        controllers: [controllers_1.PaymentController, controllers_1.OrderController, controllers_1.PaymentWebhookController],
        exports: [
            ...providers_1.paymentProviders,
            ...providers_1.orderProviders,
            services_1.PaymentService,
            services_1.CCBillService,
            services_1.CheckPaymentService,
            services_1.OrderService
        ]
    })
], PaymentModule);
exports.PaymentModule = PaymentModule;
//# sourceMappingURL=payment.module.js.map