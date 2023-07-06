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
exports.ReactionCommentListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../reaction/constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../performer/services");
const mongoose_1 = require("mongoose");
const comment_provider_1 = require("../providers/comment.provider");
const REACTION_COMMENT_TOPIC = 'REACTION_COMMENT_TOPIC';
let ReactionCommentListener = class ReactionCommentListener {
    constructor(performerService, queueEventService, commentModel) {
        this.performerService = performerService;
        this.queueEventService = queueEventService;
        this.commentModel = commentModel;
        this.queueEventService.subscribe(constants_1.REACTION_CHANNEL, REACTION_COMMENT_TOPIC, this.handleReactComment.bind(this));
    }
    async handleReactComment(event) {
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const { objectId, objectType, action } = event.data;
        if (![constants_1.REACTION_TYPE.COMMENT].includes(objectType) || action !== constants_1.REACTION.LIKE) {
            return;
        }
        const comment = await this.commentModel.findById(objectId);
        if (event.eventName === constants_2.EVENT.CREATED) {
            if (comment) {
                await this.commentModel.updateOne({ _id: objectId }, { $inc: { totalLike: 1 } });
                await this.performerService.updateLikeStat(comment.createdBy, 1);
            }
        }
        if (event.eventName === constants_2.EVENT.DELETED) {
            if (comment) {
                await this.commentModel.updateOne({ _id: objectId }, { $inc: { totalLike: -1 } });
                await this.performerService.updateLikeStat(comment.createdBy, -1);
            }
        }
    }
};
ReactionCommentListener = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(2, common_1.Inject(comment_provider_1.COMMENT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        kernel_1.QueueEventService,
        mongoose_1.Model])
], ReactionCommentListener);
exports.ReactionCommentListener = ReactionCommentListener;
//# sourceMappingURL=comment-reaction.listener.js.map