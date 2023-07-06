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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../performer/services");
const services_2 = require("../../performer-assets/services");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const moment = require("moment");
const services_3 = require("../../user/services");
const mailer_1 = require("../../mailer");
const services_4 = require("../../coupon/services");
const constants_1 = require("../../subscription/constants");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const providers_1 = require("../providers");
const constants_2 = require("../constants");
const dtos_3 = require("../dtos");
const exceptions_1 = require("../exceptions");
let OrderService = class OrderService {
    constructor(performerService, productService, videoService, couponService, userService, orderModel, orderDetailModel, mailService) {
        this.performerService = performerService;
        this.productService = productService;
        this.videoService = videoService;
        this.couponService = couponService;
        this.userService = userService;
        this.orderModel = orderModel;
        this.orderDetailModel = orderDetailModel;
        this.mailService = mailService;
    }
    async findById(id) {
        return this.orderModel.findById(id);
    }
    async findByIds(ids) {
        return this.orderModel.find({ _id: { $in: ids } });
    }
    async findByQuery(payload) {
        const data = await this.orderModel.find(payload);
        return data;
    }
    async findDetailsByQuery(payload) {
        const data = await this.orderDetailModel.find(payload);
        return data;
    }
    async search(req) {
        const query = {
            status: {
                $ne: constants_2.ORDER_STATUS.CREATED
            }
        };
        if (req.sellerId)
            query.sellerId = req.sellerId;
        if (req.buyerId)
            query.buyerId = req.buyerId;
        if (req.userId)
            query.buyerId = req.userId;
        if (req.status)
            query.status = req.status;
        if (req.deliveryStatus)
            query.deliveryStatus = req.deliveryStatus;
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate),
                $lt: moment(req.toDate)
            };
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort || -1
        };
        const [orders, total] = await Promise.all([
            this.orderModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.orderModel.countDocuments(query)
        ]);
        const data = orders.map((o) => new dtos_3.OrderDto(o));
        const orderIds = orders.map((o) => o._id);
        const performerIds = [
            ...orders.filter((o) => o.buyerSource === 'performer').map((o) => o.buyerId),
            ...orders.filter((o) => o.sellerSource === 'performer').map((o) => o.sellerId)
        ];
        const userIds = orders.filter((o) => o.buyerSource === 'user').map((o) => o.buyerId);
        const sellers = [];
        const buyers = [];
        const orderDetails = [];
        if (performerIds.length) {
            const performers = await this.performerService.findByIds(performerIds);
            sellers.push(...performers.map((p) => (new dtos_2.PerformerDto(p)).toResponse()));
        }
        if (userIds.length) {
            const users = await this.userService.findByIds(userIds);
            buyers.push(...users.map((u) => (new dtos_1.UserDto(u)).toResponse()));
        }
        if (orderIds.length) {
            const orderDetailsList = await this.orderDetailModel.find({
                orderId: {
                    $in: orderIds
                }
            });
            orderDetails.push(...orderDetailsList);
        }
        for (const order of data) {
            if (order.sellerId) {
                order.seller = sellers.find((s) => s._id.toString() === order.sellerId.toString());
            }
            if (order.buyerId) {
                order.buyer = buyers.find((b) => b._id.toString() === order.buyerId.toString());
                if (!order.buyer) {
                    order.buyer = sellers.find((b) => b._id.toString() === order.buyerId.toString());
                }
            }
            order.details = orderDetails.filter((d) => d.orderId.toString() === order._id.toString());
        }
        return {
            data,
            total
        };
    }
    async orderDetailsSearch(req) {
        const query = {
            status: {
                $ne: constants_2.ORDER_STATUS.CREATED
            }
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    orderNumber: { $regex: regexp }
                },
                {
                    name: { $regex: regexp }
                },
                {
                    description: { $regex: regexp }
                }
            ];
        }
        if (req.sellerId)
            query.sellerId = req.sellerId;
        if (req.buyerId)
            query.buyerId = req.buyerId;
        if (req.userId)
            query.buyerId = req.userId;
        if (req.status)
            query.status = req.status;
        if (req.deliveryStatus)
            query.deliveryStatus = req.deliveryStatus;
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate),
                $lt: moment(req.toDate)
            };
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort || -1
        };
        const [orders, total] = await Promise.all([
            this.orderDetailModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.orderDetailModel.countDocuments(query)
        ]);
        const sellers = [];
        const buyers = [];
        const performerIds = orders.filter((o) => o.sellerSource === 'performer').map((o) => o.sellerId);
        const userIds = orders.filter((o) => o.buyerSource === 'user').map((o) => o.buyerId);
        if (performerIds.length) {
            const performers = await this.performerService.findByIds(performerIds);
            sellers.push(...performers.map((p) => (new dtos_2.PerformerDto(p)).toResponse()));
        }
        if (userIds.length) {
            const users = await this.userService.findByIds(userIds);
            buyers.push(...users.map((u) => (new dtos_1.UserDto(u)).toResponse()));
        }
        const data = orders.map((o) => new dtos_3.OrderDetailsDto(o).toResponse());
        for (const order of data) {
            if (order.sellerId) {
                order.seller = sellers.find((s) => s._id.toString() === order.sellerId.toString());
            }
            if (order.buyerId) {
                order.buyer = buyers.find((b) => b._id.toString() === order.buyerId.toString());
            }
        }
        return {
            data,
            total
        };
    }
    async getOrderDetails(id) {
        const details = await this.orderDetailModel.findById(id);
        if (!details) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_3.OrderDetailsDto(details.toObject()).toResponse();
        if (details.buyerSource === 'user') {
            const user = await this.userService.findById(details.buyerId);
            dto.buyer = (new dtos_1.UserDto(user)).toResponse();
        }
        if (details.sellerSource === 'performer') {
            const performer = await this.performerService.findById(details.sellerId);
            dto.seller = (new dtos_2.PerformerDto(performer)).toResponse();
        }
        return dto;
    }
    async updateDetails(id, payload, currentUser) {
        var _a;
        const details = await this.orderDetailModel.findById(id);
        if (!details) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!((_a = currentUser.roles) === null || _a === void 0 ? void 0 : _a.includes('admin')) && currentUser._id.toString() !== details.sellerId.toString()) {
            throw new common_1.ForbiddenException();
        }
        const oldStatus = details.deliveryStatus;
        await this.orderDetailModel.updateOne({ _id: id }, payload);
        const newUpdate = await this.orderDetailModel.findById(id);
        if (newUpdate.deliveryStatus !== oldStatus) {
            if (details.buyerSource === 'user') {
                const user = await this.userService.findById(details.buyerId);
                if (user) {
                    await this.mailService.send({
                        subject: 'Order Status Changed',
                        to: user.email,
                        data: {
                            user,
                            order: newUpdate,
                            deliveryStatus: newUpdate.deliveryStatus,
                            oldDeliveryStatus: oldStatus
                        },
                        template: 'update-order-status'
                    });
                }
            }
        }
    }
    generateOrderNumber() {
        return `${kernel_1.StringHelper.randomString(8)}`.toUpperCase();
    }
    async getDetails(orderId) {
        return this.orderDetailModel.find({
            orderId
        });
    }
    async createFromPerformerProducts(payload, user, buyerSource = 'user', orderStatus = constants_2.ORDER_STATUS.CREATED) {
        const { products, deliveryAddress, postalCode, phoneNumber, paymentGateway = 'ccbill' } = payload;
        const productIds = payload.products.map((p) => p._id);
        const prods = await this.productService.findByIds(productIds);
        if (!products.length || !prods.length) {
            throw new kernel_1.EntityNotFoundException();
        }
        const checkSamePerformerProducts = prods.filter((p) => p.performerId.toString() === prods[0].performerId.toString());
        if (checkSamePerformerProducts.length !== prods.length) {
            throw new exceptions_1.DifferentPerformerException();
        }
        const { performerId } = prods[0];
        const performer = await this.performerService.findById(performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        let totalQuantity = 0;
        let originalPrice = 0;
        let coupon = null;
        if (payload.couponCode) {
            coupon = await this.couponService.applyCoupon(payload.couponCode, user._id);
        }
        const orderDetails = [];
        prods.forEach((p) => {
            const groupProducts = products.filter((op) => op._id.toString() === p._id.toString());
            let productQuantity = 0;
            groupProducts.forEach((op) => {
                productQuantity += op.quantity;
            });
            const originalProductPrice = productQuantity * p.price;
            const productPrice = coupon
                ? parseFloat(originalProductPrice - (originalProductPrice * coupon.value)).toFixed(2)
                : originalProductPrice;
            totalQuantity += productQuantity;
            originalPrice += originalProductPrice;
            orderDetails.push({
                buyerId: user._id,
                buyerSource: 'user',
                sellerId: performerId,
                sellerSource: 'performer',
                name: p.name,
                description: p.description,
                unitPrice: p.price,
                originalPrice: originalProductPrice,
                totalPrice: productPrice,
                productType: p.type,
                productId: p._id,
                quantity: productQuantity,
                payBy: 'money',
                deliveryStatus: constants_2.DELIVERY_STATUS.CREATED,
                deliveryAddress,
                postalCode,
                phoneNumber,
                paymentGateway,
                couponInfo: coupon
            });
        });
        const totalPrice = coupon
            ? parseFloat((originalPrice - (originalPrice * coupon.value)).toFixed(2))
            : originalPrice;
        const order = await this.orderModel.create({
            buyerId: user._id,
            buyerSource,
            sellerId: performerId,
            sellerSource: 'performer',
            type: constants_2.PAYMENT_TYPE.PERFORMER_PRODUCT,
            orderNumber: this.generateOrderNumber(),
            quantity: totalQuantity,
            originalPrice,
            totalPrice,
            couponInfo: coupon,
            status: orderStatus,
            deliveryAddress,
            postalCode,
            phoneNumber,
            paymentGateway,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await Promise.all(orderDetails.map((detail, index) => {
            detail.orderId = order._id;
            detail.orderNumber = `${order.orderNumber}-S${index + 1}`;
            return this.orderDetailModel.create(detail);
        }));
        return order;
    }
    async createFromPerformerVOD(payload, user, buyerSource = 'user', orderStatus = constants_2.ORDER_STATUS.CREATED) {
        const { paymentGateway = 'ccbill', videoId, couponCode } = payload;
        const video = await this.videoService.findById(videoId);
        if (!(video === null || video === void 0 ? void 0 : video.isSaleVideo) || !(video === null || video === void 0 ? void 0 : video.price)) {
            throw new kernel_1.EntityNotFoundException();
        }
        const { performerId } = video;
        const performer = await this.performerService.findById(performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const totalQuantity = 1;
        const originalPrice = video.price;
        let coupon = null;
        if (couponCode) {
            coupon = await this.couponService.applyCoupon(couponCode, user._id);
        }
        const productPrice = coupon
            ? parseFloat((originalPrice - (originalPrice * coupon.value)).toFixed(2))
            : originalPrice;
        const order = await this.orderModel.create({
            buyerId: user._id,
            buyerSource,
            sellerId: performerId,
            sellerSource: 'performer',
            type: constants_2.PAYMENT_TYPE.SALE_VIDEO,
            orderNumber: this.generateOrderNumber(),
            postalCode: '',
            quantity: totalQuantity,
            originalPrice,
            totalPrice: productPrice,
            couponInfo: coupon,
            status: orderStatus,
            deliveryAddress: null,
            paymentGateway,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await this.orderDetailModel.create({
            orderId: order._id,
            orderNumber: `${order.orderNumber}-S1`,
            buyerId: user._id,
            buyerSource: 'user',
            sellerId: performerId,
            sellerSource: 'performer',
            name: video.title,
            description: video.title || video.description,
            unitPrice: video.price,
            originalPrice,
            totalPrice: productPrice,
            productType: constants_2.PRODUCT_TYPE.SALE_VIDEO,
            productId: video._id,
            quantity: 1,
            payBy: 'money',
            deliveryStatus: constants_2.DELIVERY_STATUS.CREATED,
            couponInfo: coupon,
            paymentGateway
        });
        return order;
    }
    async createForPerformerSubscription(payload, user, buyerSource = 'user', orderStatus = constants_2.ORDER_STATUS.CREATED) {
        const { type, performerId, paymentGateway = 'ccbill' } = payload;
        const performer = await this.performerService.findById(performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const price = type === constants_1.SUBSCRIPTION_TYPE.MONTHLY
            ? performer.monthlyPrice : performer.yearlyPrice;
        const order = await this.orderModel.create({
            buyerId: user._id,
            buyerSource,
            sellerId: string_helper_1.toObjectId(performerId),
            sellerSource: 'performer',
            type: type === constants_1.SUBSCRIPTION_TYPE.MONTHLY ? constants_2.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : constants_2.PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
            orderNumber: this.generateOrderNumber(),
            postalCode: '',
            quantity: 1,
            totalPrice: price,
            couponInfo: null,
            status: orderStatus,
            deliveryAddress: null,
            paymentGateway,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const name = type === constants_1.SUBSCRIPTION_TYPE.MONTHLY ? `Monthly subscription for ${performer.username}` : `Yearly subscription for ${performer.username}`;
        const description = name;
        await this.orderDetailModel.create({
            orderId: order._id,
            orderNumber: `${order.orderNumber}-S1`,
            buyerId: user._id,
            buyerSource: 'user',
            sellerId: string_helper_1.toObjectId(performerId),
            sellerSource: 'performer',
            name,
            description,
            unitPrice: price,
            originalPrice: price,
            totalPrice: price,
            productType: type === constants_1.SUBSCRIPTION_TYPE.MONTHLY ? constants_2.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : constants_2.PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
            productId: performer._id,
            quantity: 1,
            paymentGateway,
            payBy: 'money',
            deliveryStatus: constants_2.DELIVERY_STATUS.CREATED,
            couponInfo: null
        });
        return order;
    }
    async createForPerformerSubscriptionRenewal({ userId, performerId, type, price, paymentGateway = 'ccbill' }, buyerSource = 'user', orderStatus = constants_2.ORDER_STATUS.CREATED) {
        const performer = await this.performerService.findById(performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const user = await this.userService.findById(userId);
        const order = await this.orderModel.create({
            buyerId: userId,
            buyerSource,
            sellerId: performerId,
            sellerSource: 'performer',
            type: type === constants_1.SUBSCRIPTION_TYPE.MONTHLY ? constants_2.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : constants_2.PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
            orderNumber: this.generateOrderNumber(),
            postalCode: '',
            quantity: 1,
            totalPrice: price,
            couponInfo: null,
            status: orderStatus,
            deliveryAddress: null,
            paymentGateway,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const name = `Renewal subscription for ${performer.username}`;
        const description = name;
        await this.orderDetailModel.create({
            orderId: order._id,
            orderNumber: `${order.orderNumber}-S1`,
            buyerId: user._id,
            buyerSource: 'user',
            sellerId: performerId,
            sellerSource: 'performer',
            name,
            description,
            unitPrice: price,
            originalPrice: price,
            totalPrice: price,
            productType: type === constants_1.SUBSCRIPTION_TYPE.MONTHLY ? constants_2.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : constants_2.PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
            productId: performer._id,
            quantity: 1,
            paymentGateway,
            payBy: 'money',
            deliveryStatus: constants_2.DELIVERY_STATUS.CREATED,
            couponInfo: null
        });
        return order;
    }
};
OrderService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_2.ProductService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_2.VideoService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_4.CouponService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_3.UserService))),
    __param(5, common_1.Inject(providers_1.ORDER_MODEL_PROVIDER)),
    __param(6, common_1.Inject(providers_1.ORDER_DETAIL_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        services_2.ProductService,
        services_2.VideoService,
        services_4.CouponService,
        services_3.UserService,
        mongoose_1.Model,
        mongoose_1.Model,
        mailer_1.MailerService])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map