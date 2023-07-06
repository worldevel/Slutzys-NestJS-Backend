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
exports.ReplyCommentListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const contants_1 = require("../contants");
const constants_1 = require("../../../kernel/constants");
const comment_service_1 = require("../services/comment.service");
const REPLY_COMMENT_CHANNEL = 'REPLY_COMMENT_CHANNEL';
let ReplyCommentListener = class ReplyCommentListener {
    constructor(queueEventService, commentService) {
        this.queueEventService = queueEventService;
        this.commentService = commentService;
        this.queueEventService.subscribe(contants_1.COMMENT_CHANNEL, REPLY_COMMENT_CHANNEL, this.handleReplyComment.bind(this));
    }
    async handleReplyComment(event) {
        try {
            if (![constants_1.EVENT.CREATED, constants_1.EVENT.DELETED].includes(event.eventName)) {
                return false;
            }
            const { objectId: commentId, objectType } = event.data;
            if (objectType !== contants_1.OBJECT_TYPE.COMMENT) {
                return false;
            }
            await this.commentService.increaseComment(commentId, event.eventName === constants_1.EVENT.CREATED ? 1 : -1);
            return true;
        }
        catch (e) {
            return false;
        }
    }
};
ReplyCommentListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        comment_service_1.CommentService])
], ReplyCommentListener);
exports.ReplyCommentListener = ReplyCommentListener;
//# sourceMappingURL=comment-reply.listener.js.map