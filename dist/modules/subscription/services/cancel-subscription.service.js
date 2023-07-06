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
exports.CancelSubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_1 = require("../../payment/services");
const services_2 = require("../../settings/services");
const constants_1 = require("../../settings/constants");
const mailer_1 = require("../../mailer");
const services_3 = require("../../performer/services");
const services_4 = require("../../user/services");
const subscription_provider_1 = require("../providers/subscription.provider");
const constants_2 = require("../constants");
let CancelSubscriptionService = class CancelSubscriptionService {
    constructor(ccbillService, performerService, userService, subscriptionModel, settingService, mailService) {
        this.ccbillService = ccbillService;
        this.performerService = performerService;
        this.userService = userService;
        this.subscriptionModel = subscriptionModel;
        this.settingService = settingService;
        this.mailService = mailService;
    }
    async cancelSubscription(id) {
        if (!string_helper_1.isObjectId(id)) {
            throw new kernel_1.EntityNotFoundException();
        }
        const subscription = await this.subscriptionModel.findById(id);
        if (!subscription || subscription.status === constants_2.SUBSCRIPTION_STATUS.DEACTIVATED)
            throw new kernel_1.EntityNotFoundException();
        if (!subscription.subscriptionId) {
            subscription.expiredAt = new Date();
            subscription.status = constants_2.SUBSCRIPTION_STATUS.DEACTIVATED;
            subscription.updatedAt = new Date();
            await subscription.save();
            await this.performerService.updateSubscriptionStat(subscription.performerId, -1);
            return { success: true };
        }
        const { paymentGateway } = subscription;
        if (paymentGateway === 'ccbill') {
            const [ccbillClientAccNo, ccbillDatalinkUsername, ccbillDatalinkPassword] = await Promise.all([
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CCBILL_CLIENT_ACCOUNT_NUMBER),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CCBILL_DATALINK_USERNAME),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CCBILL_DATALINK_PASSWROD)
            ]);
            if (!ccbillClientAccNo || !ccbillDatalinkUsername || !ccbillDatalinkPassword) {
                throw new kernel_1.EntityNotFoundException();
            }
            const status = await this.ccbillService.cancelSubscription({
                subscriptionId: subscription.subscriptionId,
                ccbillClientAccNo,
                ccbillDatalinkUsername,
                ccbillDatalinkPassword
            });
            if (!status)
                throw new common_1.HttpException('Could not cancel this subscription on CCbill, please try again later', 422);
        }
        if (paymentGateway === 'verotel') {
            throw new common_1.HttpException('We do not cancelation subscription Verotel for now, please try again later', 422);
        }
        subscription.status = constants_2.SUBSCRIPTION_STATUS.DEACTIVATED;
        subscription.updatedAt = new Date();
        await subscription.save();
        await this.performerService.updateSubscriptionStat(subscription.performerId, -1);
        const performer = await this.performerService.findById(subscription.performerId);
        const user = await this.userService.findById(subscription.userId);
        if (performer && performer.email && user) {
            await this.mailService.send({
                subject: 'Cancel Subscription',
                to: performer.email,
                data: {
                    performer,
                    user
                },
                template: 'performer-cancel-subscription'
            });
        }
        return { success: true };
    }
};
CancelSubscriptionService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.CCBillService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_3.PerformerService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_4.UserService))),
    __param(3, common_1.Inject(subscription_provider_1.SUBSCRIPTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.CCBillService,
        services_3.PerformerService,
        services_4.UserService,
        mongoose_1.Model,
        services_2.SettingService,
        mailer_1.MailerService])
], CancelSubscriptionService);
exports.CancelSubscriptionService = CancelSubscriptionService;
//# sourceMappingURL=cancel-subscription.service.js.map