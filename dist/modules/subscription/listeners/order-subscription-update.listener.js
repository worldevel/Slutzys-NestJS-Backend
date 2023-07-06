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
exports.OrderSubscriptionListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../payment/constants");
const constants_2 = require("../../../kernel/constants");
const moment = require("moment");
const models_1 = require("../../payment/models");
const services_1 = require("../../performer/services");
const services_2 = require("../../user/services");
const mailer_1 = require("../../mailer");
const subscription_provider_1 = require("../providers/subscription.provider");
const subscription_dto_1 = require("../dtos/subscription.dto");
const constants_3 = require("../constants");
const UPDATE_SUBSCRIPTION_CHANNEL = 'UPDATE_SUBSCRIPTION_CHANNEL';
let OrderSubscriptionListener = class OrderSubscriptionListener {
    constructor(performerService, userService, subscriptionModel, queueEventService, mailService) {
        this.performerService = performerService;
        this.userService = userService;
        this.subscriptionModel = subscriptionModel;
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.queueEventService.subscribe(constants_1.ORDER_PAID_SUCCESS_CHANNEL, UPDATE_SUBSCRIPTION_CHANNEL, this.handleListenSubscription.bind(this));
    }
    async handleListenSubscription(event) {
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const { transaction, order } = event.data;
        if (![constants_1.PAYMENT_TYPE.YEARLY_SUBSCRIPTION, constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION].includes(order.type)) {
            return;
        }
        if (transaction.paymentGateway === 'ccbill') {
            await this.handleCCBillSubscription(order, transaction, event.eventName);
        }
        else if (transaction.paymentGateway === 'verotel') {
            await this.handleVerotelSubscription(order, transaction, event.eventName);
        }
    }
    async handleCCBillSubscription(order, transaction, eventName) {
        var _a, _b;
        const existSubscription = await this.subscriptionModel.findOne({
            userId: order.buyerId,
            performerId: order.sellerId
        });
        const expiredAt = transaction.type === constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION
            ? moment()
                .add(30, 'days')
                .toDate()
            : moment()
                .add(365, 'days')
                .toDate();
        const subscriptionType = transaction.type === constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION
            ? constants_3.SUBSCRIPTION_TYPE.MONTHLY
            : constants_3.SUBSCRIPTION_TYPE.YEARLY;
        const subscriptionId = ((_a = transaction === null || transaction === void 0 ? void 0 : transaction.paymentResponseInfo) === null || _a === void 0 ? void 0 : _a.subscriptionId) || ((_b = transaction === null || transaction === void 0 ? void 0 : transaction.paymentResponseInfo) === null || _b === void 0 ? void 0 : _b.subscription_id) || null;
        const paymentResponseInfo = (transaction === null || transaction === void 0 ? void 0 : transaction.paymentResponseInfo) || {};
        const { paymentGateway } = transaction;
        const startRecurringDate = new Date();
        const nextRecurringDate = new Date((paymentResponseInfo === null || paymentResponseInfo === void 0 ? void 0 : paymentResponseInfo.nextRenewalDate) || expiredAt);
        if (existSubscription) {
            existSubscription.expiredAt = new Date(expiredAt);
            existSubscription.updatedAt = new Date();
            existSubscription.subscriptionType = subscriptionType;
            existSubscription.transactionId = transaction._id;
            existSubscription.meta = paymentResponseInfo;
            existSubscription.subscriptionId = subscriptionId;
            existSubscription.paymentGateway = paymentGateway;
            existSubscription.startRecurringDate = startRecurringDate;
            existSubscription.nextRecurringDate = nextRecurringDate;
            existSubscription.status = constants_2.STATUS.ACTIVE;
            await existSubscription.save();
            await this.handleMailerSubscription(new subscription_dto_1.SubscriptionDto(existSubscription));
            return new subscription_dto_1.SubscriptionDto(existSubscription);
        }
        const newSubscription = await this.subscriptionModel.create({
            performerId: order.sellerId,
            userId: order.buyerId,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiredAt: new Date(expiredAt),
            subscriptionType,
            subscriptionId,
            meta: paymentResponseInfo,
            paymentGateway,
            startRecurringDate,
            nextRecurringDate,
            transactionId: transaction._id,
            status: constants_2.STATUS.ACTIVE
        });
        await this.handleMailerSubscription(new subscription_dto_1.SubscriptionDto(newSubscription));
        await this.performerService.updateSubscriptionStat(newSubscription.performerId, eventName === constants_2.EVENT.CREATED ? 1 : -1);
        return new subscription_dto_1.SubscriptionDto(newSubscription);
    }
    async handleVerotelSubscription(order, transaction, eventName) {
        var _a, _b, _c;
        const existSubscription = await this.subscriptionModel.findOne({
            userId: order.buyerId,
            performerId: order.sellerId
        });
        const expiredAt = transaction.type === constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION
            ? moment()
                .add(30, 'days')
                .toDate()
            : moment()
                .add(365, 'days')
                .toDate();
        const subscriptionType = transaction.type === constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION
            ? constants_3.SUBSCRIPTION_TYPE.MONTHLY
            : constants_3.SUBSCRIPTION_TYPE.YEARLY;
        const subscriptionId = (_a = transaction === null || transaction === void 0 ? void 0 : transaction.paymentResponseInfo) === null || _a === void 0 ? void 0 : _a.referenceID;
        const paymentResponseInfo = (transaction === null || transaction === void 0 ? void 0 : transaction.paymentResponseInfo) || {};
        const { paymentGateway } = transaction;
        if (existSubscription) {
            existSubscription.expiredAt = new Date(expiredAt);
            existSubscription.updatedAt = new Date();
            existSubscription.subscriptionType = subscriptionType;
            existSubscription.transactionId = transaction._id;
            existSubscription.meta = paymentResponseInfo;
            existSubscription.subscriptionId = subscriptionId;
            existSubscription.paymentGateway = paymentGateway;
            existSubscription.startRecurringDate = new Date();
            existSubscription.nextRecurringDate = new Date(((_b = transaction === null || transaction === void 0 ? void 0 : transaction.paymentResponseInfo) === null || _b === void 0 ? void 0 : _b.nextChargeOn) || expiredAt);
            existSubscription.status = constants_2.STATUS.ACTIVE;
            await existSubscription.save();
            await this.handleMailerSubscription(new subscription_dto_1.SubscriptionDto(existSubscription));
            return new subscription_dto_1.SubscriptionDto(existSubscription);
        }
        const newSubscription = await this.subscriptionModel.create({
            performerId: order.sellerId,
            userId: order.buyerId,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiredAt: new Date(expiredAt),
            subscriptionType,
            subscriptionId,
            meta: paymentResponseInfo,
            paymentGateway,
            startRecurringDate: new Date(),
            nextRecurringDate: new Date(((_c = transaction === null || transaction === void 0 ? void 0 : transaction.paymentResponseInfo) === null || _c === void 0 ? void 0 : _c.nextChargeOn) || expiredAt),
            transactionId: transaction._id,
            status: constants_2.STATUS.ACTIVE
        });
        await this.handleMailerSubscription(new subscription_dto_1.SubscriptionDto(newSubscription));
        await this.performerService.updateSubscriptionStat(newSubscription.performerId, eventName === constants_2.EVENT.CREATED ? 1 : -1);
        return new subscription_dto_1.SubscriptionDto(newSubscription);
    }
    async handleMailerSubscription(subscription) {
        const [user, performer] = await Promise.all([
            this.userService.findById(subscription.userId),
            this.performerService.findById(subscription.performerId)
        ]);
        if (!user || !performer)
            return;
        if (performer.email) {
            await this.mailService.send({
                subject: 'New Subscription',
                to: performer.email,
                data: {
                    performer,
                    user
                },
                template: 'performer-new-subscription'
            });
        }
    }
};
OrderSubscriptionListener = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_2.UserService))),
    __param(2, common_1.Inject(subscription_provider_1.SUBSCRIPTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        services_2.UserService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        mailer_1.MailerService])
], OrderSubscriptionListener);
exports.OrderSubscriptionListener = OrderSubscriptionListener;
//# sourceMappingURL=order-subscription-update.listener.js.map