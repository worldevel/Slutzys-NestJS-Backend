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
exports.ReactionAssetsListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../reaction/constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../performer/services");
const services_2 = require("../services");
const REACTION_ASSETS_TOPIC = 'REACTION_ASSETS_TOPIC';
let ReactionAssetsListener = class ReactionAssetsListener {
    constructor(performerService, queueEventService, videoService, galleryService, productService) {
        this.performerService = performerService;
        this.queueEventService = queueEventService;
        this.videoService = videoService;
        this.galleryService = galleryService;
        this.productService = productService;
        this.queueEventService.subscribe(constants_1.REACTION_CHANNEL, REACTION_ASSETS_TOPIC, this.handleReaction.bind(this));
    }
    async handleReaction(event) {
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const { objectId, objectType, action } = event.data;
        const num = event.eventName === constants_2.EVENT.CREATED ? 1 : -1;
        if (objectType === constants_1.REACTION_TYPE.VIDEO) {
            const video = await this.videoService.findById(objectId);
            switch (action) {
                case constants_1.REACTION.LIKE:
                    await Promise.all([
                        this.videoService.increaseLike(objectId, num),
                        video && this.performerService.updateLikeStat(video.performerId, num)
                    ]);
                    break;
                case constants_1.REACTION.FAVOURITE:
                    await this.videoService.increaseFavourite(objectId, num);
                    break;
                case constants_1.REACTION.WATCH_LATER:
                    await this.videoService.increaseWishlist(objectId, num);
                    break;
                default: break;
            }
        }
        if (objectType === constants_1.REACTION_TYPE.GALLERY) {
            const gallery = await this.galleryService.findById(objectId);
            switch (action) {
                case constants_1.REACTION.LIKE:
                    await Promise.all([
                        this.galleryService.updateLikeStats(objectId, num),
                        gallery && this.performerService.updateLikeStat(gallery.performerId, num)
                    ]);
                    break;
                default: break;
            }
        }
        if (objectType === constants_1.REACTION_TYPE.PRODUCT) {
            const product = await this.productService.findById(objectId);
            switch (action) {
                case constants_1.REACTION.LIKE:
                    await Promise.all([
                        this.productService.updateLikeStats(objectId, num),
                        product && this.performerService.updateLikeStat(product.performerId, num)
                    ]);
                    break;
                default: break;
            }
        }
    }
};
ReactionAssetsListener = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __metadata("design:paramtypes", [services_1.PerformerService,
        kernel_1.QueueEventService,
        services_2.VideoService,
        services_2.GalleryService,
        services_2.ProductService])
], ReactionAssetsListener);
exports.ReactionAssetsListener = ReactionAssetsListener;
//# sourceMappingURL=reaction.listener.js.map