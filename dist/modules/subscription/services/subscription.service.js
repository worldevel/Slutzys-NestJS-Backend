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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const subscription_provider_1 = require("../providers/subscription.provider");
const subscription_dto_1 = require("../dtos/subscription.dto");
const constants_1 = require("../constants");
let SubscriptionService = class SubscriptionService {
    constructor(performerService, userService, subscriptionModel) {
        this.performerService = performerService;
        this.userService = userService;
        this.subscriptionModel = subscriptionModel;
    }
    async findSubscriptionList(query) {
        return this.subscriptionModel.find(query);
    }
    async countSubscriptions(query) {
        return this.subscriptionModel.countDocuments(query);
    }
    async adminCreate(data) {
        const payload = Object.assign({}, data);
        const existSubscription = await this.subscriptionModel.findOne({
            subscriptionType: constants_1.SUBSCRIPTION_TYPE.SYSTEM,
            userId: payload.userId,
            performerId: payload.performerId,
            expiredAt: payload.expiredAt
        });
        if (existSubscription) {
            existSubscription.nextRecurringDate = null;
            existSubscription.startRecurringDate = new Date();
            existSubscription.expiredAt = new Date(payload.expiredAt);
            existSubscription.updatedAt = new Date();
            existSubscription.subscriptionType = payload.subscriptionType;
            await existSubscription.save();
            await this.performerService.updateSubscriptionStat(existSubscription.performerId, 1);
            return new subscription_dto_1.SubscriptionDto(existSubscription);
        }
        payload.createdAt = new Date();
        payload.updatedAt = new Date();
        const newSubscription = await this.subscriptionModel.create(payload);
        await this.performerService.updateSubscriptionStat(newSubscription.performerId, 1);
        return new subscription_dto_1.SubscriptionDto(newSubscription);
    }
    async adminSearch(req) {
        const query = {};
        if (req.userId) {
            query.userId = req.userId;
        }
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.subscriptionType) {
            query.subscriptionType = req.subscriptionType;
        }
        const sort = {
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.subscriptionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.subscriptionModel.countDocuments(query)
        ]);
        const subscriptions = data.map((d) => new subscription_dto_1.SubscriptionDto(d));
        const UIds = data.map((d) => d.userId);
        const PIds = data.map((d) => d.performerId);
        const [users, performers] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            PIds.length ? this.performerService.findByIds(PIds) : []
        ]);
        subscriptions.forEach((subscription) => {
            const performer = performers.find((p) => p._id.toString() === subscription.performerId.toString());
            const user = users.find((u) => u._id.toString() === subscription.userId.toString());
            subscription.userInfo = user ? new dtos_1.UserDto(user).toResponse() : null;
            subscription.performerInfo = performer ? new dtos_2.PerformerDto(performer).toResponse() : null;
        });
        return {
            data: subscriptions,
            total
        };
    }
    async performerSearch(req, user) {
        const query = {
            performerId: user._id
        };
        if (req.userId) {
            query.userId = req.userId;
        }
        if (req.subscriptionType) {
            query.subscriptionType = req.subscriptionType;
        }
        const sort = {
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.subscriptionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.subscriptionModel.countDocuments(query)
        ]);
        const subscriptions = data.map((d) => new subscription_dto_1.SubscriptionDto(d));
        const UIds = data.map((d) => d.userId);
        const [users] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : []
        ]);
        subscriptions.forEach((subscription) => {
            const userSearch = users.find((u) => u._id.toString() === subscription.userId.toString());
            subscription.userInfo = userSearch ? new dtos_1.UserDto(userSearch).toResponse() : null;
        });
        return {
            data: subscriptions,
            total
        };
    }
    async userSearch(req, user) {
        const query = {
            userId: user._id
        };
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.subscriptionType) {
            query.subscriptionType = req.subscriptionType;
        }
        const sort = {
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.subscriptionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.subscriptionModel.countDocuments(query)
        ]);
        const subscriptions = data.map((d) => new subscription_dto_1.SubscriptionDto(d));
        const UIds = data.map((d) => d.userId);
        const PIds = data.map((d) => d.performerId);
        const [users, performers] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            PIds.length ? this.performerService.findByIds(PIds) : []
        ]);
        subscriptions.forEach((subscription) => {
            const performer = performers.find((p) => p._id.toString() === subscription.performerId.toString());
            const userSearch = users.find((u) => u._id.toString() === subscription.userId.toString());
            subscription.userInfo = userSearch ? new dtos_1.UserDto(userSearch).toResponse() : null;
            subscription.performerInfo = performer ? new dtos_2.PerformerDto(performer).toResponse() : null;
        });
        return {
            data: subscriptions,
            total
        };
    }
    async checkSubscribed(performerId, userId) {
        if (performerId.toString() === userId.toString()) {
            return 1;
        }
        return this.subscriptionModel.countDocuments({
            performerId,
            userId,
            expiredAt: { $gt: new Date() },
            status: constants_1.SUBSCRIPTION_STATUS.ACTIVE
        });
    }
    async findOneSubscription(performerId, userId) {
        const subscription = await this.subscriptionModel.findOne({
            performerId,
            userId
        });
        return subscription;
    }
    async performerTotalSubscriptions(performerId) {
        return this.subscriptionModel.countDocuments({ performerId, expiredAt: { $gt: new Date() } });
    }
    async findById(id) {
        const data = await this.subscriptionModel.findById(id);
        return data;
    }
    async delete(id) {
        const subscription = await this.findById(id);
        if (!subscription) {
            throw new kernel_1.EntityNotFoundException();
        }
        await subscription.remove();
        await this.performerService.updateSubscriptionStat(subscription.performerId, -1);
        return true;
    }
    async findBySubscriptionId(subscriptionId) {
        return this.subscriptionModel.findOne({
            subscriptionId
        });
    }
};
SubscriptionService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.UserService))),
    __param(2, common_1.Inject(subscription_provider_1.SUBSCRIPTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_1.UserService,
        mongoose_1.Model])
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map