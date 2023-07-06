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
exports.OrderListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../settings/services");
const services_2 = require("../../performer/services");
const services_3 = require("../../user/services");
const mailer_1 = require("../../mailer");
const providers_1 = require("../providers");
const constants_3 = require("../constants");
const ORDER_CHANNEL = 'ORDER_CHANNEL';
let OrderListener = class OrderListener {
    constructor(performerService, userService, mailService, orderModel, orderDetailsModel, queueEventService) {
        this.performerService = performerService;
        this.userService = userService;
        this.mailService = mailService;
        this.orderModel = orderModel;
        this.orderDetailsModel = orderDetailsModel;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe(constants_1.TRANSACTION_SUCCESS_CHANNEL, ORDER_CHANNEL, this.handleListen.bind(this));
    }
    async handleEmailProducts(order, orderDetails) {
        const adminEmail = services_1.SettingService.getByKey('adminEmail').value || process.env.ADMIN_EMAIL;
        const performer = await this.performerService.findById(order.sellerId);
        const user = await this.userService.findById(order.buyerId);
        if (!user || !performer) {
            return false;
        }
        const data = {
            performer,
            user,
            order,
            orderDetails
        };
        if (performer.email) {
            await this.mailService.send({
                subject: 'New payment success',
                to: performer.email,
                data,
                template: 'performer-payment-success'
            });
        }
        if (adminEmail) {
            await this.mailService.send({
                subject: 'New payment success',
                to: adminEmail,
                data,
                template: 'admin-payment-success'
            });
        }
        if (user.email) {
            await this.mailService.send({
                subject: 'New payment success',
                to: user.email,
                data,
                template: 'user-payment-success'
            });
        }
        return true;
    }
    async handleEmailSubscription(order, orderDetails) {
        const adminEmail = services_1.SettingService.getByKey('adminEmail').value || process.env.ADMIN_EMAIL;
        const performer = await this.performerService.findById(order.sellerId);
        const user = await this.userService.findById(order.buyerId);
        if (!user || !performer) {
            return false;
        }
        const data = {
            performer,
            user,
            order,
            orderDetails
        };
        if (adminEmail) {
            await this.mailService.send({
                subject: 'New payment success',
                to: adminEmail,
                data,
                template: 'admin-payment-success'
            });
        }
        if (user.email) {
            await this.mailService.send({
                subject: 'New payment success',
                to: user.email,
                data,
                template: 'user-payment-success'
            });
        }
        return true;
    }
    async handleListen(event) {
        if (event.eventName !== constants_2.EVENT.CREATED) {
            return;
        }
        const transaction = event.data;
        if ((transaction === null || transaction === void 0 ? void 0 : transaction.status) !== constants_3.PAYMENT_STATUS.SUCCESS) {
            return;
        }
        const order = await this.orderModel.findById(transaction.orderId);
        if (!order) {
            return;
        }
        order.status = constants_3.ORDER_STATUS.PAID;
        await order.save();
        const orderDetails = await this.orderDetailsModel.find({ orderId: order._id });
        for (const detail of orderDetails) {
            detail.paymentStatus = constants_3.PAYMENT_STATUS.SUCCESS;
            detail.status = constants_3.ORDER_STATUS.PAID;
            if (detail.productType !== 'physical') {
                detail.deliveryStatus = constants_1.DELIVERY_STATUS.DELIVERED;
            }
            await detail.save();
        }
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_1.ORDER_PAID_SUCCESS_CHANNEL,
            eventName: constants_2.EVENT.CREATED,
            data: {
                order,
                orderDetails,
                transaction
            }
        }));
        switch (order.type) {
            case constants_1.PAYMENT_TYPE.PERFORMER_PRODUCT:
                await this.handleEmailProducts(order, orderDetails);
                break;
            case constants_1.PAYMENT_TYPE.SALE_VIDEO:
                await this.handleEmailProducts(order, orderDetails);
                break;
            case constants_1.PAYMENT_TYPE.YEARLY_SUBSCRIPTION:
                await this.handleEmailSubscription(order, orderDetails);
                break;
            case constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION:
                await this.handleEmailSubscription(order, orderDetails);
                break;
            default: break;
        }
    }
};
OrderListener = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_3.UserService))),
    __param(3, common_1.Inject(providers_1.ORDER_MODEL_PROVIDER)),
    __param(4, common_1.Inject(providers_1.ORDER_DETAIL_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_3.UserService,
        mailer_1.MailerService,
        mongoose_1.Model,
        mongoose_1.Model,
        kernel_1.QueueEventService])
], OrderListener);
exports.OrderListener = OrderListener;
//# sourceMappingURL=order.listener.js.map