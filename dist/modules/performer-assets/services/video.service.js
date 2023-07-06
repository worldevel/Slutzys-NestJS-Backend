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
exports.VideoService = exports.PERFORMER_COUNT_VIDEO_CHANNEL = exports.PERFORMER_VIDEO_TEASER_CHANNEL = exports.PERFORMER_VIDEO_CHANNEL = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const file_1 = require("../../file");
const services_1 = require("../../file/services");
const reaction_service_1 = require("../../reaction/services/reaction.service");
const services_2 = require("../../performer/services");
const lodash_1 = require("lodash");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../../file/constants");
const dtos_1 = require("../../performer/dtos");
const dtos_2 = require("../../user/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const constants_3 = require("../../reaction/constants");
const services_3 = require("../../payment/services");
const dtos_3 = require("../dtos");
const constants_4 = require("../constants");
const providers_1 = require("../providers");
exports.PERFORMER_VIDEO_CHANNEL = 'PERFORMER_VIDEO_CHANNEL';
exports.PERFORMER_VIDEO_TEASER_CHANNEL = 'PERFORMER_VIDEO_TEASER_CHANNEL';
exports.PERFORMER_COUNT_VIDEO_CHANNEL = 'PERFORMER_COUNT_VIDEO_CHANNEL';
const FILE_PROCESSED_TOPIC = 'FILE_PROCESSED';
const TEASER_PROCESSED_TOPIC = 'TEASER_PROCESSED_TOPIC';
const SCHEDULE_VIDEO_AGENDA = 'SCHEDULE_VIDEO_AGENDA';
let VideoService = class VideoService {
    constructor(performerService, reactionService, checkPaymentService, subscriptionService, PerformerVideoModel, queueEventService, fileService, agenda) {
        this.performerService = performerService;
        this.reactionService = reactionService;
        this.checkPaymentService = checkPaymentService;
        this.subscriptionService = subscriptionService;
        this.PerformerVideoModel = PerformerVideoModel;
        this.queueEventService = queueEventService;
        this.fileService = fileService;
        this.agenda = agenda;
        this.queueEventService.subscribe(exports.PERFORMER_VIDEO_TEASER_CHANNEL, TEASER_PROCESSED_TOPIC, this.handleTeaserProcessed.bind(this));
        this.queueEventService.subscribe(exports.PERFORMER_VIDEO_CHANNEL, FILE_PROCESSED_TOPIC, this.handleFileProcessed.bind(this));
        this.defineJobs();
    }
    async defineJobs() {
        const collection = this.agenda._collection;
        await collection.deleteMany({
            name: {
                $in: [
                    SCHEDULE_VIDEO_AGENDA
                ]
            }
        });
        this.agenda.define(SCHEDULE_VIDEO_AGENDA, {}, this.scheduleVideo.bind(this));
        this.agenda.schedule('10 seconds from now', SCHEDULE_VIDEO_AGENDA, {});
    }
    async scheduleVideo(job, done) {
        try {
            const videos = await this.PerformerVideoModel.find({
                isSchedule: true,
                scheduledAt: { $lte: new Date() }
            }).lean();
            for (const video of videos) {
                const v = new dtos_3.VideoDto(video);
                await this.PerformerVideoModel.updateOne({
                    _id: v._id
                }, {
                    isSchedule: false,
                    status: constants_4.VIDEO_STATUS.ACTIVE,
                    updatedAt: new Date()
                });
                const oldStatus = video.status;
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: exports.PERFORMER_COUNT_VIDEO_CHANNEL,
                    eventName: constants_1.EVENT.UPDATED,
                    data: Object.assign(Object.assign({}, v), { oldStatus })
                }));
            }
        }
        catch (e) {
            console.log('Schedule video error', e);
        }
        finally {
            job.remove();
            this.agenda.schedule('1 hour from now', SCHEDULE_VIDEO_AGENDA, {});
            typeof done === 'function' && done();
        }
    }
    async findById(id) {
        const video = await this.PerformerVideoModel.findById(id);
        return new dtos_3.VideoDto(video);
    }
    async findByIds(ids) {
        const videos = await this.PerformerVideoModel.find({ _id: { $in: ids } });
        return videos;
    }
    getVideoForView(fileDto, video, jwToken) {
        let fileUrl = fileDto.getUrl();
        if (video && jwToken) {
            fileUrl = `${fileUrl}?videoId=${video._id}&token=${jwToken}`;
        }
        return {
            width: fileDto === null || fileDto === void 0 ? void 0 : fileDto.width,
            height: fileDto === null || fileDto === void 0 ? void 0 : fileDto.height,
            url: fileUrl,
            duration: fileDto.duration,
            thumbnails: (fileDto.thumbnails || []).map((thumb) => file_1.FileDto.getPublicUrl(thumb.path))
        };
    }
    async handleTeaserProcessed(event) {
        const { eventName, data } = event;
        if (eventName !== services_1.FILE_EVENT.VIDEO_PROCESSED) {
            return;
        }
        const { videoId } = data.meta;
        const [video] = await Promise.all([
            this.PerformerVideoModel.findById(videoId)
        ]);
        if (!video) {
            await this.fileService.remove(data.fileId);
            return;
        }
        video.teaserProcessing = false;
        await video.save();
    }
    async handleFileProcessed(event) {
        const { eventName } = event;
        if (eventName !== services_1.FILE_EVENT.VIDEO_PROCESSED) {
            return;
        }
        const { videoId } = event.data.meta;
        const [video, file] = await Promise.all([
            this.PerformerVideoModel.findById(videoId),
            this.fileService.findById(event.data.fileId)
        ]);
        if (!video) {
            await this.fileService.remove(event.data.fileId);
            return;
        }
        const oldStatus = video.status;
        video.processing = false;
        if (file.status === 'error') {
            video.status = constants_4.VIDEO_STATUS.FILE_ERROR;
        }
        await video.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_COUNT_VIDEO_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: Object.assign(Object.assign({}, new dtos_3.VideoDto(video)), { oldStatus })
        }));
    }
    async create(video, teaser, thumbnail, payload, creator) {
        let valid = true;
        if (!video)
            valid = false;
        if (!valid && thumbnail) {
            await this.fileService.remove(thumbnail._id);
        }
        if (!valid && teaser) {
            await this.fileService.remove(teaser._id);
        }
        if (thumbnail && !thumbnail.isImage()) {
            await this.fileService.remove(thumbnail._id);
        }
        if (video && !video.mimeType.toLowerCase().includes('video')) {
            await this.fileService.remove(video._id);
        }
        if (teaser && !teaser.mimeType.toLowerCase().includes('video')) {
            await this.fileService.remove(teaser._id);
        }
        if (!valid) {
            throw new common_1.HttpException('Invalid file format', 400);
        }
        const model = new this.PerformerVideoModel(payload);
        model.fileId = video._id;
        if (!model.performerId && creator) {
            model.performerId = creator._id;
        }
        model.thumbnailId = thumbnail ? thumbnail._id : null;
        if (teaser) {
            model.teaserId = teaser._id;
            model.teaserProcessing = true;
        }
        model.processing = true;
        model.slug = kernel_1.StringHelper.createAlias(payload.title);
        const slugCheck = await this.PerformerVideoModel.countDocuments({
            slug: model.slug
        });
        if (slugCheck) {
            model.slug = `${model.slug}-${kernel_1.StringHelper.randomString(8)}`;
        }
        creator && model.set('createdBy', creator._id);
        model.createdAt = new Date();
        model.updatedAt = new Date();
        await model.save();
        await Promise.all([
            model.thumbnailId && this.fileService.addRef(model.thumbnailId, {
                itemId: model._id,
                itemType: constants_2.REF_TYPE.VIDEO
            }),
            model.teaserId && this.fileService.addRef(model.teaserId, {
                itemId: model._id,
                itemType: constants_2.REF_TYPE.VIDEO
            }),
            model.fileId && this.fileService.addRef(model.fileId, {
                itemType: constants_2.REF_TYPE.VIDEO,
                itemId: model._id
            })
        ]);
        if (model.status === constants_4.VIDEO_STATUS.ACTIVE) {
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: exports.PERFORMER_COUNT_VIDEO_CHANNEL,
                eventName: constants_1.EVENT.CREATED,
                data: new dtos_3.VideoDto(model)
            }));
        }
        await this.fileService.queueProcessVideo(model.fileId, {
            publishChannel: exports.PERFORMER_VIDEO_CHANNEL,
            meta: {
                videoId: model._id
            }
        });
        model.teaserId && await this.fileService.queueProcessVideo(model.teaserId, {
            publishChannel: exports.PERFORMER_VIDEO_TEASER_CHANNEL,
            meta: {
                videoId: model._id
            }
        });
        return new dtos_3.VideoDto(model);
    }
    async getDetails(videoId, jwToken) {
        const query = string_helper_1.isObjectId(videoId) ? { _id: videoId } : { slug: videoId };
        const video = await this.PerformerVideoModel.findOne(query);
        if (!video)
            throw new kernel_1.EntityNotFoundException();
        const participantIds = video.participantIds.filter((p) => kernel_1.StringHelper.isObjectId(p));
        const [performer, videoFile, thumbnailFile, teaserFile, participants] = await Promise.all([
            this.performerService.findById(video.performerId),
            this.fileService.findById(video.fileId),
            video.thumbnailId ? this.fileService.findById(video.thumbnailId) : null,
            video.teaserId ? this.fileService.findById(video.teaserId) : null,
            video.participantIds.length ? await this.performerService.findByIds(participantIds) : []
        ]);
        const dto = new dtos_3.VideoDto(video);
        dto.thumbnail = thumbnailFile ? {
            url: thumbnailFile.getUrl(),
            thumbnails: thumbnailFile.getThumbnails()
        } : null;
        dto.teaser = teaserFile ? this.getVideoForView(teaserFile, dto, '') : null;
        dto.video = this.getVideoForView(videoFile, dto, jwToken);
        dto.performer = performer ? new dtos_1.PerformerDto(performer).toPublicDetailsResponse() : null;
        dto.participants = participants.map((p) => new dtos_1.PerformerDto(p).toResponse());
        return dto;
    }
    async userGetDetails(videoId, currentUser, jwToken) {
        const query = string_helper_1.isObjectId(videoId) ? { _id: videoId } : { slug: videoId };
        const video = await this.PerformerVideoModel.findOne(query);
        if (!video)
            throw new kernel_1.EntityNotFoundException();
        const participantIds = video.participantIds.filter((p) => kernel_1.StringHelper.isObjectId(p));
        const fileIds = [video.fileId];
        video.teaserId && fileIds.push(video.teaserId);
        video.thumbnailId && fileIds.push(video.thumbnailId);
        const [performer, files, participants, reactions] = await Promise.all([
            this.performerService.findById(video.performerId),
            this.fileService.findByIds(fileIds),
            video.participantIds.length ? await this.performerService.findByIds(participantIds) : [],
            currentUser ? this.reactionService.findByQuery({ objectType: constants_3.REACTION_TYPE.VIDEO, objectId: video._id, createdBy: currentUser._id }) : []
        ]);
        const dto = new dtos_3.IVideoResponse(video);
        const thumbnailFile = files.find((f) => `${f._id}` === `${dto.thumbnailId}`);
        const teaserFile = files.find((f) => `${f._id}` === `${dto.teaserId}`);
        const videoFile = files.find((f) => `${f._id}` === `${dto.fileId}`);
        dto.isLiked = !!reactions.filter((r) => r.action === constants_3.REACTION.LIKE).length;
        dto.isFavourited = !!reactions.filter((r) => r.action === constants_3.REACTION.FAVOURITE).length;
        dto.isWishlist = !!reactions.filter((r) => r.action === constants_3.REACTION.WATCH_LATER).length;
        if (!dto.isSaleVideo) {
            const subscribed = currentUser && await this.subscriptionService.checkSubscribed(dto.performerId, currentUser._id);
            dto.isSubscribed = !!subscribed;
        }
        if (dto.isSaleVideo) {
            const bought = currentUser && await this.checkPaymentService.checkBoughtVideo(dto, currentUser);
            dto.video = this.getVideoForView(videoFile, dto, jwToken);
            dto.isBought = !!bought;
        }
        if (currentUser && currentUser.roles && currentUser.roles.includes('admin')) {
            dto.isBought = true;
            dto.isSubscribed = true;
        }
        dto.thumbnail = thumbnailFile ? {
            url: thumbnailFile.getUrl(),
            thumbnails: thumbnailFile.getThumbnails()
        } : null;
        dto.teaser = teaserFile ? this.getVideoForView(teaserFile, dto, jwToken) : null;
        dto.video = this.getVideoForView(videoFile, dto, jwToken);
        dto.performer = performer ? new dtos_1.PerformerDto(performer).toPublicDetailsResponse() : null;
        dto.participants = participants.map((p) => new dtos_1.PerformerDto(p).toPublicDetailsResponse());
        return dto;
    }
    async updateInfo(id, payload, files, updater) {
        var _a;
        const { video: videoFile, thumbnail: thumbnailFile, teaser: teaserFile } = files;
        const video = await this.PerformerVideoModel.findById(id);
        if (!video) {
            throw new kernel_1.EntityNotFoundException();
        }
        const { fileId, thumbnailId, teaserId } = video;
        if (videoFile && videoFile._id) {
            video.fileId = videoFile._id;
        }
        if (thumbnailFile && thumbnailFile._id) {
            video.thumbnailId = thumbnailFile._id;
        }
        if (teaserFile && teaserFile._id) {
            video.teaserId = teaserFile._id;
        }
        if (videoFile && !((_a = videoFile === null || videoFile === void 0 ? void 0 : videoFile.mimeType) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('video'))) {
            await this.fileService.remove(videoFile._id);
            delete video.fileId;
        }
        if (thumbnailFile && !thumbnailFile.isImage()) {
            await this.fileService.remove(thumbnailFile._id);
            delete video.thumbnailId;
        }
        if (teaserFile && !teaserFile.mimeType.toLowerCase().includes('video')) {
            await this.fileService.remove(teaserFile._id);
            delete video.teaserId;
        }
        const oldStatus = video.status;
        let { slug } = video;
        if (payload.title !== video.title) {
            slug = kernel_1.StringHelper.createAlias(payload.title);
            const slugCheck = await this.PerformerVideoModel.countDocuments({
                slug,
                _id: { $ne: video._id }
            });
            if (slugCheck) {
                slug = `${slug}-${kernel_1.StringHelper.randomString(8)}`;
            }
        }
        lodash_1.merge(video, payload);
        if (video.status !== constants_4.VIDEO_STATUS.FILE_ERROR && payload.status !== constants_4.VIDEO_STATUS.FILE_ERROR) {
            video.status = payload.status;
        }
        if (payload.tags) {
            video.tags = payload.tags;
            video.markModified('tags');
        }
        if (payload.participantIds) {
            video.participantIds = payload.participantIds;
            video.markModified('participantIds');
        }
        updater && video.set('updatedBy', updater._id);
        video.updatedAt = new Date();
        video.slug = slug;
        await video.save();
        const dto = new dtos_3.VideoDto(video);
        if (thumbnailFile && `${video.thumbnailId}` !== `${thumbnailId}`) {
            await Promise.all([
                this.fileService.addRef(video.thumbnailId, {
                    itemId: video._id,
                    itemType: constants_2.REF_TYPE.VIDEO
                }),
                thumbnailId && this.fileService.remove(thumbnailId)
            ]);
        }
        if (videoFile && `${video.fileId}` !== `${fileId}`) {
            await Promise.all([
                this.fileService.addRef(video.fileId, {
                    itemId: video._id,
                    itemType: constants_2.REF_TYPE.VIDEO
                }),
                fileId && this.fileService.remove(fileId),
                this.fileService.queueProcessVideo(video.fileId, {
                    publishChannel: exports.PERFORMER_VIDEO_CHANNEL,
                    meta: {
                        videoId: video._id
                    }
                })
            ]);
        }
        if (teaserFile && `${video.teaserId}` !== `${teaserId}`) {
            await Promise.all([
                this.fileService.addRef(video.teaserId, {
                    itemId: video._id,
                    itemType: constants_2.REF_TYPE.VIDEO
                }),
                teaserId && this.fileService.remove(teaserId),
                this.fileService.queueProcessVideo(video.teaserId, {
                    publishChannel: exports.PERFORMER_VIDEO_TEASER_CHANNEL,
                    meta: {
                        videoId: video._id
                    }
                })
            ]);
        }
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_COUNT_VIDEO_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: Object.assign(Object.assign({}, dto), { oldStatus })
        }));
        return dto;
    }
    async delete(id) {
        const video = await this.PerformerVideoModel.findById(id);
        if (!video) {
            throw new kernel_1.EntityNotFoundException();
        }
        await video.remove();
        video.fileId && (await this.fileService.remove(video.fileId));
        video.thumbnailId && (await this.fileService.remove(video.fileId));
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_COUNT_VIDEO_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new dtos_3.VideoDto(video)
        }));
        return true;
    }
    async increaseView(id) {
        return this.PerformerVideoModel.updateOne({ _id: id }, {
            $inc: { 'stats.views': 1 }
        });
    }
    async increaseComment(id, num = 1) {
        return this.PerformerVideoModel.updateOne({ _id: id }, {
            $inc: { 'stats.comments': num }
        });
    }
    async increaseLike(id, num = 1) {
        return this.PerformerVideoModel.updateOne({ _id: id }, {
            $inc: { 'stats.likes': num }
        });
    }
    async increaseFavourite(id, num = 1) {
        return this.PerformerVideoModel.updateOne({ _id: id }, {
            $inc: { 'stats.favourites': num }
        });
    }
    async increaseWishlist(id, num = 1) {
        return this.PerformerVideoModel.updateOne({ _id: id }, {
            $inc: { 'stats.wishlists': num }
        });
    }
    async checkAuth(req, user) {
        const { query } = req;
        if (!query.videoId) {
            throw new kernel_1.ForbiddenException();
        }
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        const video = await this.PerformerVideoModel.findById(query.videoId);
        if (!video)
            throw new kernel_1.EntityNotFoundException();
        if (user._id.toString() === video.performerId.toString()) {
            return true;
        }
        if (!video.isSaleVideo) {
            const subscribed = await this.subscriptionService.checkSubscribed(video.performerId, user._id);
            if (!subscribed) {
                throw new kernel_1.ForbiddenException();
            }
            return true;
        }
        if (video.isSaleVideo) {
            const bought = await this.checkPaymentService.checkBoughtVideo(new dtos_3.VideoDto(video), user);
            if (!bought) {
                throw new kernel_1.ForbiddenException();
            }
            return true;
        }
        throw new kernel_1.ForbiddenException();
    }
};
VideoService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => reaction_service_1.ReactionService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_3.CheckPaymentService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => subscription_service_1.SubscriptionService))),
    __param(4, common_1.Inject(providers_1.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        reaction_service_1.ReactionService,
        services_3.CheckPaymentService,
        subscription_service_1.SubscriptionService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.FileService,
        kernel_1.AgendaService])
], VideoService);
exports.VideoService = VideoService;
//# sourceMappingURL=video.service.js.map