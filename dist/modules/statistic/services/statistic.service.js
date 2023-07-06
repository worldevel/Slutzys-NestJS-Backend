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
exports.StatisticService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../subscription/constants");
const providers_1 = require("../../performer-assets/providers");
const providers_2 = require("../../user/providers");
const providers_3 = require("../../performer/providers");
const subscription_provider_1 = require("../../subscription/providers/subscription.provider");
const providers_4 = require("../../payment/providers");
const earning_provider_1 = require("../../earning/providers/earning.provider");
const constants_2 = require("../../user/constants");
const constants_3 = require("../../performer/constants");
const constants_4 = require("../../payment/constants");
let StatisticService = class StatisticService {
    constructor(galleryModel, photoModel, productModel, videoModel, userModel, performerModel, subscriptionModel, orderDetailModel, earningModel) {
        this.galleryModel = galleryModel;
        this.photoModel = photoModel;
        this.productModel = productModel;
        this.videoModel = videoModel;
        this.userModel = userModel;
        this.performerModel = performerModel;
        this.subscriptionModel = subscriptionModel;
        this.orderDetailModel = orderDetailModel;
        this.earningModel = earningModel;
    }
    async stats() {
        var _a, _b;
        const totalActiveUsers = await this.userModel.countDocuments({ status: constants_2.STATUS_ACTIVE });
        const totalInactiveUsers = await this.userModel.countDocuments({ status: constants_2.STATUS_INACTIVE });
        const totalPendingUsers = await this.userModel.countDocuments({ status: constants_2.STATUS_PENDING_EMAIL_CONFIRMATION });
        const totalActivePerformers = await this.performerModel.countDocuments({ status: constants_2.STATUS_ACTIVE });
        const totalInactivePerformers = await this.performerModel.countDocuments({ status: constants_2.STATUS_INACTIVE });
        const totalPendingPerformers = await this.performerModel.countDocuments({ status: constants_3.PERFORMER_STATUSES.PENDING });
        const totalGalleries = await this.galleryModel.countDocuments({});
        const totalPhotos = await this.photoModel.countDocuments({});
        const totalVideos = await this.videoModel.countDocuments({});
        const totalActiveSubscribers = await this.subscriptionModel.countDocuments({ expiredAt: { $gt: new Date() }, status: constants_1.SUBSCRIPTION_STATUS.ACTIVE });
        const totalSubscribers = await this.subscriptionModel.countDocuments({});
        const totalCreatedOrders = await this.orderDetailModel.countDocuments({ deliveryStatus: constants_4.ORDER_STATUS.CREATED });
        const totalDeliveredOrders = await this.orderDetailModel.countDocuments({ deliveryStatus: constants_4.ORDER_STATUS.DELIVERED });
        const totalShippingdOrders = await this.orderDetailModel.countDocuments({ deliveryStatus: constants_4.ORDER_STATUS.SHIPPING });
        const totalRefundedOrders = await this.orderDetailModel.countDocuments({ deliveryStatus: constants_4.ORDER_STATUS.REFUNDED });
        const totalProducts = await this.productModel.countDocuments({});
        const [totalGrossPrice, totalNetPrice] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$grossPrice'
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ])
        ]);
        return {
            totalActiveUsers,
            totalInactiveUsers,
            totalPendingUsers,
            totalActivePerformers,
            totalInactivePerformers,
            totalPendingPerformers,
            totalGalleries,
            totalPhotos,
            totalVideos,
            totalProducts,
            totalActiveSubscribers,
            totalSubscribers,
            totalCreatedOrders,
            totalDeliveredOrders,
            totalShippingdOrders,
            totalRefundedOrders,
            totalGrossPrice: ((totalGrossPrice === null || totalGrossPrice === void 0 ? void 0 : totalGrossPrice.length) && ((_a = totalGrossPrice[0]) === null || _a === void 0 ? void 0 : _a.total)) || 0,
            totalNetPrice: ((totalGrossPrice === null || totalGrossPrice === void 0 ? void 0 : totalGrossPrice.length) && ((_b = totalNetPrice[0]) === null || _b === void 0 ? void 0 : _b.total)) || 0
        };
    }
};
StatisticService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_GALLERY_MODEL_PROVIDER)),
    __param(1, common_1.Inject(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __param(2, common_1.Inject(providers_1.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __param(3, common_1.Inject(providers_1.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __param(4, common_1.Inject(providers_2.USER_MODEL_PROVIDER)),
    __param(5, common_1.Inject(providers_3.PERFORMER_MODEL_PROVIDER)),
    __param(6, common_1.Inject(subscription_provider_1.SUBSCRIPTION_MODEL_PROVIDER)),
    __param(7, common_1.Inject(providers_4.ORDER_DETAIL_MODEL_PROVIDER)),
    __param(8, common_1.Inject(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], StatisticService);
exports.StatisticService = StatisticService;
//# sourceMappingURL=statistic.service.js.map