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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentAssetsListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const contants_1 = require("../../comment/contants");
const constants_1 = require("../../../kernel/constants");
const video_service_1 = require("../services/video.service");
const services_1 = require("../services");
const COMMENT_ASSETS_TOPIC = 'COMMENT_ASSETS_TOPIC';
let CommentAssetsListener = class CommentAssetsListener {
    constructor(queueEventService, videoService, productService, galleryService) {
        this.queueEventService = queueEventService;
        this.videoService = videoService;
        this.productService = productService;
        this.galleryService = galleryService;
        this.queueEventService.subscribe(contants_1.COMMENT_CHANNEL, COMMENT_ASSETS_TOPIC, this.handleComment.bind(this));
    }
    async handleComment(event) {
        try {
            if (![constants_1.EVENT.CREATED, constants_1.EVENT.DELETED].includes(event.eventName)) {
                return;
            }
            const { objectId, objectType } = event.data;
            if (objectType === contants_1.OBJECT_TYPE.VIDEO) {
                await this.videoService.increaseComment(objectId, event.eventName === constants_1.EVENT.CREATED ? 1 : -1);
            }
            if (objectType === contants_1.OBJECT_TYPE.PRODUCT) {
                await this.productService.updateCommentStats(objectId, event.eventName === constants_1.EVENT.CREATED ? 1 : -1);
            }
            if (objectType === contants_1.OBJECT_TYPE.GALLERY) {
                await this.galleryService.updateCommentStats(objectId, event.eventName === constants_1.EVENT.CREATED ? 1 : -1);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
};
CommentAssetsListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        video_service_1.VideoService,
        services_1.ProductService,
        services_1.GalleryService])
], CommentAssetsListener);
exports.CommentAssetsListener = CommentAssetsListener;
//# sourceMappingURL=comment.listener.js.map