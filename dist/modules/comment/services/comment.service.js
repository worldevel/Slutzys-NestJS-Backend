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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const dtos_1 = require("../../performer/dtos");
const reaction_service_1 = require("../../reaction/services/reaction.service");
const comment_provider_1 = require("../providers/comment.provider");
const dtos_2 = require("../../user/dtos");
const comment_dto_1 = require("../dtos/comment.dto");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const contants_1 = require("../contants");
let CommentService = class CommentService {
    constructor(performerService, userService, commentModel, queueEventService, reactionService) {
        this.performerService = performerService;
        this.userService = userService;
        this.commentModel = commentModel;
        this.queueEventService = queueEventService;
        this.reactionService = reactionService;
    }
    async increaseComment(commentId, num = 1) {
        await this.commentModel.updateOne({ _id: commentId }, { $inc: { totalReply: num } });
    }
    async create(data, user) {
        const comment = Object.assign({}, data);
        comment.createdBy = user._id;
        comment.createdAt = new Date();
        comment.updatedAt = new Date();
        const newComment = await this.commentModel.create(comment);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: contants_1.COMMENT_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new comment_dto_1.CommentDto(newComment)
        }));
        const returnData = new comment_dto_1.CommentDto(newComment);
        returnData.creator = user;
        return returnData;
    }
    async update(id, payload, user) {
        const comment = await this.commentModel.findById(id);
        if (!comment) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign({}, payload);
        if (comment.createdBy.toString() !== user._id.toString()) {
            throw new kernel_1.ForbiddenException();
        }
        await this.commentModel.updateOne({ _id: id }, data);
        return { updated: true };
    }
    async delete(id, user) {
        const comment = await this.commentModel.findById(id);
        if (!comment) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (comment.createdBy.toString() !== user._id.toString()) {
            throw new kernel_1.ForbiddenException();
        }
        await this.commentModel.deleteOne({ _id: id });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: contants_1.COMMENT_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new comment_dto_1.CommentDto(comment)
        }));
        return { deleted: true };
    }
    async search(req, user) {
        const query = {};
        if (req.objectId) {
            query.objectId = req.objectId;
        }
        const sort = {
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.commentModel
                .find(query)
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.commentModel.countDocuments(query)
        ]);
        const comments = data.map((d) => new comment_dto_1.CommentDto(d));
        const commentIds = data.map((d) => d._id);
        const UIds = data.map((d) => d.createdBy);
        const [users, performers, reactions] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            UIds.length ? this.performerService.findByIds(UIds) : [],
            user && commentIds.length ? this.reactionService.findByQuery({ objectId: { $in: commentIds }, createdBy: user._id }) : []
        ]);
        comments.forEach((comment) => {
            const performer = performers.find((p) => p._id.toString() === comment.createdBy.toString());
            const userComment = users.find((u) => u._id.toString() === comment.createdBy.toString());
            const liked = reactions.find((reaction) => reaction.objectId.toString() === comment._id.toString());
            comment.creator = performer
                ? new dtos_1.PerformerDto(performer).toSearchResponse()
                : (userComment ? new dtos_2.UserDto(userComment).toResponse() : null);
            comment.isLiked = !!liked;
        });
        return {
            data: comments,
            total
        };
    }
};
CommentService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.UserService))),
    __param(2, common_1.Inject(comment_provider_1.COMMENT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_1.UserService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        reaction_service_1.ReactionService])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map