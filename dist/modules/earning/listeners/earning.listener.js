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
exports.TransactionEarningListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../payment/constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../performer/services");
const settings_1 = require("../../settings");
const earning_provider_1 = require("../providers/earning.provider");
const constants_3 = require("../../payment/constants");
const constants_4 = require("../../settings/constants");
const UPDATE_EARNING_CHANNEL = 'EARNING_CHANNEL';
let TransactionEarningListener = class TransactionEarningListener {
    constructor(settingService, performerService, earningModel, queueEventService) {
        this.settingService = settingService;
        this.performerService = performerService;
        this.earningModel = earningModel;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe(constants_1.ORDER_PAID_SUCCESS_CHANNEL, UPDATE_EARNING_CHANNEL, this.handleListenEarning.bind(this));
    }
    async handleListenEarning(event) {
        try {
            if (event.eventName !== constants_2.EVENT.CREATED) {
                return;
            }
            const { orderDetails, transaction } = event.data;
            if ((transaction === null || transaction === void 0 ? void 0 : transaction.status) !== constants_3.PAYMENT_STATUS.SUCCESS) {
                return;
            }
            const [settingMonthlyCommission, settingYearlyCommission, settingProductCommission, settingVideoCommission] = await Promise.all([
                this.settingService.getKeyValue(constants_4.SETTING_KEYS.MONTHLY_SUBSCRIPTION_COMMISSION),
                this.settingService.getKeyValue(constants_4.SETTING_KEYS.YEARLY_SUBSCRIPTION_COMMISSION),
                this.settingService.getKeyValue(constants_4.SETTING_KEYS.PRODUCT_SALE_COMMISSION),
                this.settingService.getKeyValue(constants_4.SETTING_KEYS.VIDEO_SALE_COMMISSION)
            ]);
            for (const orderDetail of orderDetails) {
                if (orderDetail.sellerSource === 'performer' && orderDetail.status === constants_1.ORDER_STATUS.PAID) {
                    const performerCommissions = await this.performerService.getCommissions(transaction.performerId);
                    let commission = 0.2;
                    let sourceType = 'n/a';
                    const defaultCommission = 0.2;
                    switch (orderDetail.productType) {
                        case constants_1.PRODUCT_TYPE.PERFORMER_PRODUCT:
                        case constants_1.PRODUCT_TYPE.DIGITAL_PRODUCT:
                        case constants_1.PRODUCT_TYPE.PHYSICAL_PRODUCT:
                            commission = (performerCommissions === null || performerCommissions === void 0 ? void 0 : performerCommissions.productSaleCommission) || settingProductCommission || defaultCommission;
                            sourceType = 'product';
                            break;
                        case constants_1.PRODUCT_TYPE.SALE_VIDEO:
                            commission = (performerCommissions === null || performerCommissions === void 0 ? void 0 : performerCommissions.videoSaleCommission) || settingVideoCommission || defaultCommission;
                            sourceType = 'video';
                            break;
                        case constants_1.PRODUCT_TYPE.YEARLY_SUBSCRIPTION:
                            commission = (performerCommissions === null || performerCommissions === void 0 ? void 0 : performerCommissions.yearlySubscriptionCommission) || settingYearlyCommission || defaultCommission;
                            sourceType = 'performer';
                            break;
                        case constants_1.PRODUCT_TYPE.MONTHLY_SUBSCRIPTION:
                            commission = (performerCommissions === null || performerCommissions === void 0 ? void 0 : performerCommissions.monthlySubscriptionCommission) || settingMonthlyCommission || defaultCommission;
                            sourceType = 'performer';
                            break;
                        default: break;
                    }
                    const netPrice = (orderDetail.totalPrice - (orderDetail.totalPrice * commission)).toFixed(2);
                    const newEarning = new this.earningModel();
                    newEarning.set('commission', commission);
                    newEarning.set('grossPrice', orderDetail.totalPrice);
                    newEarning.set('netPrice', netPrice);
                    newEarning.set('performerId', orderDetail.sellerId);
                    newEarning.set('userId', orderDetail.buyerId);
                    newEarning.set('transactionId', transaction._id);
                    newEarning.set('orderId', orderDetail._id);
                    newEarning.set('type', orderDetail.productType);
                    newEarning.set('sourceType', sourceType);
                    newEarning.set('createdAt', new Date(transaction.createdAt));
                    newEarning.set('isPaid', false);
                    newEarning.set('transactionStatus', transaction.status);
                    await newEarning.save();
                }
            }
        }
        catch (e) {
        }
    }
};
TransactionEarningListener = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => settings_1.SettingService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(2, common_1.Inject(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [settings_1.SettingService,
        services_1.PerformerService,
        mongoose_1.Model,
        kernel_1.QueueEventService])
], TransactionEarningListener);
exports.TransactionEarningListener = TransactionEarningListener;
//# sourceMappingURL=earning.listener.js.map