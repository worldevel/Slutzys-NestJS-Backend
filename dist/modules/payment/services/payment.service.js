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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../performer/services");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const mongoose_1 = require("mongoose");
const services_2 = require("../../user/services");
const providers_1 = require("../providers");
const constants_2 = require("../constants");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const ccbill_service_1 = require("./ccbill.service");
const order_service_1 = require("./order.service");
const exceptions_1 = require("../exceptions");
const verotel_service_1 = require("./verotel.service");
let PaymentService = class PaymentService {
    constructor(performerService, paymentTransactionModel, ccbillService, queueEventService, subscriptionService, orderService, userService, verotelService) {
        this.performerService = performerService;
        this.paymentTransactionModel = paymentTransactionModel;
        this.ccbillService = ccbillService;
        this.queueEventService = queueEventService;
        this.subscriptionService = subscriptionService;
        this.orderService = orderService;
        this.userService = userService;
        this.verotelService = verotelService;
    }
    async findById(id) {
        return this.paymentTransactionModel.findById(id);
    }
    async create(transaction) {
        return this.paymentTransactionModel.create(transaction);
    }
    async getPerformerSinglePaymentGatewaySetting(performerId, paymentGateway = 'ccbill') {
        var _a, _b, _c;
        const performerPaymentSetting = await this.performerService.getPaymentSetting(performerId, paymentGateway);
        const flexformId = (_a = performerPaymentSetting === null || performerPaymentSetting === void 0 ? void 0 : performerPaymentSetting.value) === null || _a === void 0 ? void 0 : _a.flexformId;
        const subAccountNumber = (_b = performerPaymentSetting === null || performerPaymentSetting === void 0 ? void 0 : performerPaymentSetting.value) === null || _b === void 0 ? void 0 : _b.singlePurchaseSubAccountNumber;
        const salt = (_c = performerPaymentSetting === null || performerPaymentSetting === void 0 ? void 0 : performerPaymentSetting.value) === null || _c === void 0 ? void 0 : _c.salt;
        if (!performerPaymentSetting || !flexformId || !subAccountNumber || !salt) {
            throw new exceptions_1.MissingConfigPaymentException();
        }
        return {
            flexformId,
            subAccountNumber,
            salt
        };
    }
    async getPerformerSubscroptionPaymentGatewaySetting(performerId, paymentGateway = 'ccbill') {
        var _a, _b, _c;
        const performerPaymentSetting = await this.performerService.getPaymentSetting(performerId, paymentGateway);
        const flexformId = (_a = performerPaymentSetting === null || performerPaymentSetting === void 0 ? void 0 : performerPaymentSetting.value) === null || _a === void 0 ? void 0 : _a.flexformId;
        const subAccountNumber = (_b = performerPaymentSetting === null || performerPaymentSetting === void 0 ? void 0 : performerPaymentSetting.value) === null || _b === void 0 ? void 0 : _b.subscriptionSubAccountNumber;
        const salt = (_c = performerPaymentSetting === null || performerPaymentSetting === void 0 ? void 0 : performerPaymentSetting.value) === null || _c === void 0 ? void 0 : _c.salt;
        if (!performerPaymentSetting || !flexformId || !subAccountNumber || !salt) {
            throw new exceptions_1.MissingConfigPaymentException();
        }
        return {
            flexformId,
            subAccountNumber,
            salt
        };
    }
    async subscribePerformer(order, paymentGateway = 'ccbill') {
        if (paymentGateway === 'verotel') {
            const transaction = await this.paymentTransactionModel.create({
                paymentGateway,
                orderId: order._id,
                source: order.buyerSource,
                sourceId: order.buyerId,
                type: order.type,
                totalPrice: order.totalPrice,
                products: [],
                status: constants_2.PAYMENT_STATUS.PENDING
            });
            const orderDetails = await this.orderService.getDetails(order._id);
            const description = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.map((o) => o.name).join('; ');
            const data = await this.verotelService.createRecurringRequestFromTransaction(transaction, {
                description,
                userId: order.buyerId,
                performerId: order.sellerId
            });
            await this.paymentTransactionModel.updateOne({ _id: transaction._id }, {
                $set: {
                    paymentToken: data.signature
                }
            });
            return data;
        }
        if (paymentGateway === 'ccbill') {
            const { flexformId, subAccountNumber, salt } = await this.getPerformerSubscroptionPaymentGatewaySetting(order.sellerId);
            const transaction = await this.paymentTransactionModel.create({
                paymentGateway,
                orderId: order._id,
                source: order.buyerSource,
                sourceId: order.buyerId,
                type: order.type,
                totalPrice: order.totalPrice,
                products: [],
                status: constants_2.PAYMENT_STATUS.PENDING
            });
            return this.ccbillService.subscription({
                salt,
                flexformId,
                subAccountNumber,
                price: parseFloat(order.totalPrice.toFixed(2)),
                transactionId: transaction._id,
                subscriptionType: order.type
            });
        }
        throw new exceptions_1.MissingConfigPaymentException();
    }
    async purchasePerformerProducts(order, paymentGateway = 'ccbill') {
        if (paymentGateway === 'verotel') {
            const transaction = await this.paymentTransactionModel.create({
                paymentGateway,
                orderId: order._id,
                source: order.buyerSource,
                sourceId: order.buyerId,
                type: order.type,
                totalPrice: order.totalPrice,
                products: [],
                status: constants_2.PAYMENT_STATUS.PENDING
            });
            const orderDetails = await this.orderService.getDetails(order._id);
            const description = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.map((o) => o.name).join('; ');
            const data = await this.verotelService.createSingleRequestFromTransaction(transaction, {
                description,
                userId: order.buyerId
            });
            await this.paymentTransactionModel.updateOne({ _id: transaction._id }, {
                $set: {
                    paymentToken: data.signature
                }
            });
            return data;
        }
        if (paymentGateway === 'ccbill') {
            const { flexformId, subAccountNumber, salt } = await this.getPerformerSinglePaymentGatewaySetting(order.sellerId);
            const transaction = await this.paymentTransactionModel.create({
                paymentGateway,
                orderId: order._id,
                source: order.buyerSource,
                sourceId: order.buyerId,
                type: order.type,
                totalPrice: order.totalPrice,
                status: constants_2.PAYMENT_STATUS.PENDING,
                products: []
            });
            return this.ccbillService.singlePurchase({
                salt,
                flexformId,
                subAccountNumber,
                price: order.totalPrice,
                transactionId: transaction._id
            });
        }
        throw new exceptions_1.MissingConfigPaymentException();
    }
    async purchasePerformerVOD(order, paymentGateway = 'ccbill') {
        if (paymentGateway === 'verotel') {
            const transaction = await this.paymentTransactionModel.create({
                paymentGateway,
                orderId: order._id,
                source: order.buyerSource,
                sourceId: order.buyerId,
                type: order.type,
                totalPrice: order.totalPrice,
                products: [],
                status: constants_2.PAYMENT_STATUS.PENDING
            });
            const orderDetails = await this.orderService.getDetails(order._id);
            const description = orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.map((o) => o.name).join('; ');
            const data = await this.verotelService.createSingleRequestFromTransaction(transaction, {
                description,
                userId: order.buyerId
            });
            await this.paymentTransactionModel.updateOne({ _id: transaction._id }, {
                $set: {
                    paymentToken: data.signature
                }
            });
            return data;
        }
        if (paymentGateway === 'ccbill') {
            const { flexformId, subAccountNumber, salt } = await this.getPerformerSinglePaymentGatewaySetting(order.sellerId);
            const transaction = await this.paymentTransactionModel.create({
                paymentGateway,
                orderId: order._id,
                source: order.buyerSource,
                sourceId: order.buyerId,
                type: order.type,
                totalPrice: order.totalPrice,
                status: constants_2.PAYMENT_STATUS.PENDING,
                products: []
            });
            return this.ccbillService.singlePurchase({
                salt,
                flexformId,
                subAccountNumber,
                price: order.totalPrice,
                transactionId: transaction._id
            });
        }
        throw new exceptions_1.MissingConfigPaymentException();
    }
    async ccbillSinglePaymentSuccessWebhook(payload) {
        const transactionId = payload['X-transactionId'] || payload.transactionId;
        if (!transactionId) {
            throw new common_1.BadRequestException();
        }
        const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
        if (!checkForHexRegExp.test(transactionId)) {
            return { ok: false };
        }
        const transaction = await this.paymentTransactionModel.findById(transactionId);
        if (!transaction || transaction.status !== constants_2.PAYMENT_STATUS.PENDING) {
            return { ok: false };
        }
        transaction.status = constants_2.PAYMENT_STATUS.SUCCESS;
        transaction.paymentResponseInfo = payload;
        transaction.updatedAt = new Date();
        await transaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: transaction
        }));
        return { ok: true };
    }
    async ccbillRenewalSuccessWebhook(payload) {
        const subscriptionId = payload.subscriptionId || payload.subscription_id;
        if (!subscriptionId) {
            throw new common_1.BadRequestException();
        }
        const subscription = await this.subscriptionService.findBySubscriptionId(subscriptionId);
        if (!subscription) {
            return { ok: false };
        }
        const price = payload.billedAmount || payload.accountingAmount;
        const { userId } = subscription;
        const { performerId } = subscription;
        const order = await this.orderService.createForPerformerSubscriptionRenewal({
            userId,
            performerId,
            price,
            type: subscription.subscriptionType
        });
        const transaction = await this.paymentTransactionModel.create({
            paymentGateway: 'verotel',
            orderId: order._id,
            source: order.buyerSource,
            sourceId: order.buyerId,
            type: order.type,
            totalPrice: order.totalPrice,
            status: constants_2.PAYMENT_STATUS.SUCCESS,
            paymentResponseInfo: payload,
            products: []
        });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: transaction
        }));
        return { ok: true };
    }
    async verotelSuccessWebhook(payload) {
        const isValid = await this.verotelService.isValidSignatureFromQuery(payload);
        if (!isValid)
            throw new Error('Invalid signature');
        const transaction = await this.paymentTransactionModel.findOne({
            _id: payload.referenceID
        });
        if (!transaction)
            throw new Error('Transaction not found!');
        if (['purchase'].includes(payload.type) || (payload.subscriptionType === 'recurring' && payload.event === 'initial')) {
            if (transaction.status !== constants_2.PAYMENT_STATUS.PENDING)
                throw new Error('Invalid transaction status');
            transaction.status = constants_2.PAYMENT_STATUS.SUCCESS;
            transaction.paymentResponseInfo = payload;
            transaction.updatedAt = new Date();
            await transaction.save();
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: constants_2.TRANSACTION_SUCCESS_CHANNEL,
                eventName: constants_1.EVENT.CREATED,
                data: transaction
            }));
            return true;
        }
        if (payload.type === 'rebill') {
            const subscription = await this.subscriptionService.findBySubscriptionId(payload.referenceID);
            if (!subscription) {
                return false;
            }
            const price = payload.amount;
            const { userId, performerId } = subscription;
            const order = await this.orderService.createForPerformerSubscriptionRenewal({
                userId,
                performerId,
                price,
                type: subscription.subscriptionType
            });
            const newTransaction = await this.paymentTransactionModel.create({
                paymentGateway: 'verotel',
                orderId: order._id,
                source: order.buyerSource,
                sourceId: order.buyerId,
                type: order.type,
                totalPrice: order.totalPrice,
                status: constants_2.PAYMENT_STATUS.SUCCESS,
                paymentResponseInfo: payload,
                products: []
            });
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: constants_2.TRANSACTION_SUCCESS_CHANNEL,
                eventName: constants_1.EVENT.CREATED,
                data: newTransaction
            }));
        }
        return true;
    }
};
PaymentService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(1, common_1.Inject(providers_1.PAYMENT_TRANSACTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        mongoose_1.Model,
        ccbill_service_1.CCBillService,
        kernel_1.QueueEventService,
        subscription_service_1.SubscriptionService,
        order_service_1.OrderService,
        services_2.UserService,
        verotel_service_1.VerotelService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map