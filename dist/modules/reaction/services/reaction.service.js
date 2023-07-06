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
exports.ReactionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const video_service_1 = require("../../performer-assets/services/video.service");
const lodash_1 = require("lodash");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const services_1 = require("../../payment/services");
const dtos_1 = require("../../performer-assets/dtos");
const constants_2 = require("../../subscription/constants");
const constants_3 = require("../../payment/constants");
const services_2 = require("../../file/services");
const reaction_provider_1 = require("../providers/reaction.provider");
const reaction_dto_1 = require("../dtos/reaction.dto");
const services_3 = require("../../user/services");
const services_4 = require("../../performer/services");
const constants_4 = require("../constants");
let ReactionService = class ReactionService {
    constructor(performerService, videoService, subscriptionService, orderService, userService, fileService, reactionModel, queueEventService) {
        this.performerService = performerService;
        this.videoService = videoService;
        this.subscriptionService = subscriptionService;
        this.orderService = orderService;
        this.userService = userService;
        this.fileService = fileService;
        this.reactionModel = reactionModel;
        this.queueEventService = queueEventService;
    }
    async findByQuery(payload) {
        return this.reactionModel.find(payload);
    }
    async create(data, user) {
        const reaction = Object.assign({}, data);
        const existReact = await this.reactionModel.findOne({
            objectType: reaction.objectType,
            objectId: reaction.objectId,
            createdBy: user._id,
            action: reaction.action
        });
        if (existReact) {
            return existReact;
        }
        reaction.createdBy = user._id;
        reaction.createdAt = new Date();
        reaction.updatedAt = new Date();
        const newreaction = await this.reactionModel.create(reaction);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.REACTION_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new reaction_dto_1.ReactionDto(newreaction)
        }));
        return newreaction;
    }
    async remove(payload, user) {
        const reaction = await this.reactionModel.findOne({
            objectType: payload.objectType || constants_4.REACTION_TYPE.VIDEO,
            objectId: payload.objectId,
            createdBy: user._id,
            action: payload.action
        });
        if (!reaction) {
            return false;
        }
        await reaction.remove();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.REACTION_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new reaction_dto_1.ReactionDto(reaction)
        }));
        return true;
    }
    async search(req) {
        const query = {};
        if (req.objectId) {
            query.objectId = req.objectId;
        }
        const sort = {
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.reactionModel
                .find(query)
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.reactionModel.countDocuments(query)
        ]);
        const reactions = data.map((d) => new reaction_dto_1.ReactionDto(d));
        const UIds = data.map((d) => d.createdBy);
        const [users, performers] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            UIds.length ? this.performerService.findByIds(UIds) : []
        ]);
        reactions.forEach((reaction) => {
            const performer = performers.find((p) => p._id.toString() === reaction.createdBy.toString());
            const user = users.find((u) => u._id.toString() === reaction.createdBy.toString());
            reaction.creator = performer || user;
        });
        return {
            data: reactions,
            total
        };
    }
    async getListVideos(req, user, jwToken) {
        const query = {};
        if (req.createdBy)
            query.createdBy = req.createdBy;
        if (req.action)
            query.action = req.action;
        query.objectType = constants_4.REACTION_TYPE.VIDEO;
        const sort = {
            [req.sortBy || 'createdAt']: req.sort === 'desc' ? -1 : 1
        };
        const [items, total] = await Promise.all([
            this.reactionModel
                .find(query)
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.reactionModel.countDocuments(query)
        ]);
        const videoIds = lodash_1.uniq(items.map((i) => i.objectId));
        const videos = videoIds.length ? await this.videoService.findByIds(videoIds) : [];
        const fileIds = [];
        videos.forEach((v) => {
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
        });
        const performerIds = lodash_1.uniq(videos.map((v) => v.performerId));
        const [files, subscriptions, orders] = await Promise.all([
            fileIds.length ? this.fileService.findByIds(fileIds) : [],
            performerIds ? this.subscriptionService.findSubscriptionList({
                userId: user._id,
                performerIds: { $in: performerIds },
                expiredAt: { $gt: new Date() },
                status: constants_2.SUBSCRIPTION_STATUS.ACTIVE
            }) : [],
            videoIds.length ? this.orderService.findDetailsByQuery({
                buyerId: user._id,
                productId: { $in: videoIds },
                status: constants_3.ORDER_STATUS.PAID,
                productType: constants_3.PRODUCT_TYPE.SALE_VIDEO
            }) : []
        ]);
        const reactions = items.map((v) => new reaction_dto_1.ReactionDto(v));
        reactions.forEach((item) => {
            const video = videos.find((p) => `${p._id}` === `${item.objectId}`);
            const subscribed = video && subscriptions.find((s) => `${s.performerId}` === `${video.performerId}`);
            const bought = video && orders.find((o) => `${o.productId}` === `${video._id}`);
            if (video) {
                item.objectInfo = video ? new dtos_1.VideoDto(video) : null;
                item.objectInfo.isSubscribed = !!subscribed;
                item.objectInfo.isBought = !!bought;
                if (video && video.thumbnailId) {
                    const thumbnail = files.find((f) => f._id.toString() === video.thumbnailId.toString());
                    if (thumbnail) {
                        item.objectInfo.thumbnail = thumbnail.getUrl();
                    }
                }
                if (video && video.fileId) {
                    const file = files.find((f) => f._id.toString() === video.fileId.toString());
                    if (file) {
                        item.objectInfo.video = this.videoService.getVideoForView(file, new dtos_1.VideoDto(video), jwToken);
                    }
                }
            }
        });
        return {
            data: reactions,
            total
        };
    }
    async checkExisting(objectId, userId, action, objectType) {
        return this.reactionModel.countDocuments({
            objectId, createdBy: userId, action, objectType
        });
    }
};
ReactionService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_4.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => video_service_1.VideoService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => subscription_service_1.SubscriptionService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_1.OrderService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_3.UserService))),
    __param(5, common_1.Inject(common_1.forwardRef(() => services_2.FileService))),
    __param(6, common_1.Inject(reaction_provider_1.REACT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_4.PerformerService,
        video_service_1.VideoService,
        subscription_service_1.SubscriptionService,
        services_1.OrderService,
        services_3.UserService,
        services_2.FileService,
        mongoose_1.Model,
        kernel_1.QueueEventService])
], ReactionService);
exports.ReactionService = ReactionService;
//# sourceMappingURL=reaction.service.js.map