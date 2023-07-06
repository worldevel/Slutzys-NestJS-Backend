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
exports.VideoSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const services_2 = require("../../file/services");
const dtos_1 = require("../../user/dtos");
const constants_1 = require("../../../kernel/constants");
const dtos_2 = require("../../performer/dtos");
const dtos_3 = require("../dtos");
const providers_1 = require("../providers");
let VideoSearchService = class VideoSearchService {
    constructor(performerService, videoModel, fileService) {
        this.performerService = performerService;
        this.videoModel = videoModel;
        this.fileService = fileService;
    }
    async adminSearch(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    title: { $regex: regexp }
                },
                {
                    description: { $regex: regexp }
                },
                { tags: { $elemMatch: { $regex: regexp } } }
            ];
        }
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.status)
            query.status = req.status;
        if (req.isSaleVideo)
            query.isSaleVideo = req.isSaleVideo === 'true';
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.videoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.videoModel.countDocuments(query)
        ]);
        const performerIds = [];
        const fileIds = [];
        data.forEach((v) => {
            v.performerId && performerIds.push(v.performerId);
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
        });
        const [performers, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const videos = data.map((v) => new dtos_3.VideoDto(v));
        videos.forEach((v) => {
            if (v.performerId) {
                const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
                if (performer) {
                    v.performer = new dtos_2.PerformerDto(performer).toSearchResponse();
                }
            }
            if (v.thumbnailId) {
                const thumbnail = files.find((f) => f._id.toString() === v.thumbnailId.toString());
                if (thumbnail) {
                    v.thumbnail = {
                        url: thumbnail.getUrl(),
                        thumbnails: thumbnail.getThumbnails()
                    };
                }
            }
            if (v.fileId) {
                const video = files.find((f) => f._id.toString() === v.fileId.toString());
                if (video) {
                    v.video = {
                        url: video.getUrl(),
                        thumbnails: video.getThumbnails(),
                        duration: video.duration
                    };
                }
            }
        });
        return {
            data: videos,
            total
        };
    }
    async performerSearch(req, performer) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    title: { $regex: regexp }
                },
                {
                    description: { $regex: regexp }
                },
                { tags: { $elemMatch: { $regex: regexp } } }
            ];
        }
        query.performerId = performer._id;
        if (req.isSaleVideo)
            query.isSaleVideo = req.isSaleVideo === 'true';
        if (req.status)
            query.status = req.status;
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.videoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.videoModel.countDocuments(query)
        ]);
        const fileIds = [];
        data.forEach((v) => {
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
            v.teaserId && fileIds.push(v.teaserId);
        });
        const [files] = await Promise.all([
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const videos = data.map((v) => new dtos_3.VideoDto(v));
        videos.forEach((v) => {
            if (v.thumbnailId) {
                const thumbnail = files.find((f) => f._id.toString() === v.thumbnailId.toString());
                if (thumbnail) {
                    v.thumbnail = {
                        url: thumbnail.getUrl(),
                        thumbnails: thumbnail.getThumbnails()
                    };
                }
            }
            if (v.teaserId) {
                const teaser = files.find((f) => f._id.toString() === v.teaserId.toString());
                if (teaser) {
                    v.teaser = {
                        url: teaser.getUrl(),
                        thumbnails: teaser.getThumbnails()
                    };
                }
            }
            if (v.fileId) {
                const video = files.find((f) => f._id.toString() === v.fileId.toString());
                if (video) {
                    v.video = {
                        url: video.getUrl(),
                        thumbnails: video.getThumbnails(),
                        duration: video.duration
                    };
                }
            }
        });
        return {
            data: videos,
            total
        };
    }
    async userSearch(req) {
        const query = {
            status: constants_1.STATUS.ACTIVE
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    title: { $regex: regexp }
                },
                {
                    description: { $regex: regexp }
                },
                { tags: { $elemMatch: { $regex: regexp } } }
            ];
        }
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.isSaleVideo)
            query.isSaleVideo = req.isSaleVideo === 'true';
        if (req.excludedId)
            query._id = { $ne: req.excludedId };
        if (req.ids && Array.isArray(req.ids)) {
            query._id = {
                $in: req.ids
            };
        }
        let sort = { createdAt: -1 };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.videoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.videoModel.countDocuments(query)
        ]);
        const fileIds = [];
        data.forEach((v) => {
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
            v.teaserId && fileIds.push(v.teaserId);
        });
        const [files] = await Promise.all([
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const videos = data.map((v) => new dtos_3.VideoDto(v));
        videos.forEach((v) => {
            if (v.thumbnailId) {
                const thumbnail = files.find((f) => f._id.toString() === v.thumbnailId.toString());
                if (thumbnail) {
                    v.thumbnail = {
                        url: thumbnail.getUrl(),
                        thumbnails: thumbnail.getThumbnails()
                    };
                }
            }
            if (v.teaserId) {
                const teaser = files.find((f) => f._id.toString() === v.teaserId.toString());
                if (teaser) {
                    v.teaser = {
                        url: null,
                        thumbnails: teaser.getThumbnails(),
                        duration: teaser.duration
                    };
                }
            }
            if (v.fileId) {
                const video = files.find((f) => f._id.toString() === v.fileId.toString());
                if (video) {
                    v.video = {
                        url: null,
                        thumbnails: video.getThumbnails(),
                        duration: video.duration
                    };
                }
            }
        });
        return {
            data: videos,
            total
        };
    }
};
VideoSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(1, common_1.Inject(providers_1.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        mongoose_1.Model,
        services_2.FileService])
], VideoSearchService);
exports.VideoSearchService = VideoSearchService;
//# sourceMappingURL=video-search.service.js.map