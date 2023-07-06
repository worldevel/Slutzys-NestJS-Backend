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
exports.PhotoSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const services_2 = require("../../file/services");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const providers_1 = require("../providers");
const dtos_3 = require("../dtos");
const gallery_service_1 = require("./gallery.service");
let PhotoSearchService = class PhotoSearchService {
    constructor(performerService, photoModel, galleryService, fileService) {
        this.performerService = performerService;
        this.photoModel = photoModel;
        this.galleryService = galleryService;
        this.fileService = fileService;
    }
    async adminSearch(req, jwToken) {
        const query = {};
        if (req.q)
            query.title = { $regex: req.q };
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.galleryId)
            query.galleryId = req.galleryId;
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
            this.photoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.photoModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const galleryIds = data.map((d) => d.galleryId);
        const fileIds = data.map((d) => d.fileId);
        const photos = data.map((v) => new dtos_3.PhotoDto(v));
        const [performers, galleries, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            galleryIds.length ? this.galleryService.findByIds(galleryIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        photos.forEach((v) => {
            const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = new dtos_2.PerformerDto(performer).toResponse();
            }
            if (v.galleryId) {
                const gallery = galleries.find((p) => p._id.toString() === v.galleryId.toString());
                if (gallery)
                    v.gallery = gallery;
            }
            const file = files.find((f) => f._id.toString() === v.fileId.toString());
            if (file) {
                const url = file.getUrl();
                v.photo = {
                    size: file.size,
                    thumbnails: file.getThumbnails(),
                    url: jwToken ? `${url}?photoId=${v._id}&token=${jwToken}` : url || null,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                };
            }
        });
        return {
            data: photos,
            total
        };
    }
    async performerSearch(req, user, jwToken) {
        const query = {};
        if (req.q)
            query.title = { $regex: req.q };
        query.performerId = user._id;
        if (req.galleryId)
            query.galleryId = req.galleryId;
        if (req.status)
            query.status = req.status;
        const [data, total] = await Promise.all([
            this.photoModel
                .find(query)
                .lean()
                .sort('-createdAt')
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.photoModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const fileIds = data.map((d) => d.fileId);
        const photos = data.map((v) => new dtos_3.PhotoDto(v));
        const [performers, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        photos.forEach((v) => {
            const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = new dtos_2.PerformerDto(performer).toResponse();
            }
            const file = files.find((f) => f._id.toString() === v.fileId.toString());
            if (file) {
                const url = file.getUrl();
                v.photo = {
                    size: file.size,
                    thumbnails: file.getThumbnails(),
                    url: jwToken ? `${url}?photoId=${v._id}&token=${jwToken}` : url || null,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                };
            }
        });
        return {
            data: photos,
            total
        };
    }
    async getModelPhotosWithGalleryCheck(req, jwToken) {
        const query = {
            galleryId: req.galleryId,
            status: 'active',
            processing: false
        };
        const sort = { createdAt: -1 };
        const [data, total] = await Promise.all([
            this.photoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.photoModel.countDocuments(query)
        ]);
        const fileIds = data.map((d) => d.fileId);
        const photos = data.map((v) => new dtos_3.PhotoDto(v));
        const galleryIds = data.filter((d) => d.galleryId).map((p) => p.galleryId);
        const [galleries, files] = await Promise.all([
            galleryIds.length ? this.galleryService.findByIds(galleryIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        photos.forEach((v) => {
            if (v.galleryId) {
                const gallery = galleries.find((p) => p._id.toString() === v.galleryId.toString());
                if (gallery)
                    v.gallery = gallery;
            }
            const file = files.find((f) => f._id.toString() === v.fileId.toString());
            if (file) {
                const url = file.getUrl();
                v.photo = {
                    size: file.size,
                    thumbnails: file.getThumbnails(),
                    url: jwToken ? `${url}?photoId=${v._id}&token=${jwToken}` : url || null,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                };
            }
        });
        return {
            data: photos,
            total
        };
    }
    async searchPhotos(req, jwToken) {
        const query = {
            processing: false
        };
        if (req.galleryId)
            query.galleryId = req.galleryId;
        const sort = { createdAt: -1 };
        const [data, total] = await Promise.all([
            this.photoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.photoModel.countDocuments(query)
        ]);
        const fileIds = data.map((d) => d.fileId);
        const photos = data.map((v) => new dtos_3.PhotoDto(v));
        const galleryIds = data.filter((d) => d.galleryId).map((p) => p.galleryId);
        const [galleries, files] = await Promise.all([
            galleryIds.length ? this.galleryService.findByIds(galleryIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        photos.forEach((v) => {
            if (v.galleryId) {
                const gallery = galleries.find((p) => p._id.toString() === v.galleryId.toString());
                if (gallery)
                    v.gallery = gallery;
            }
            const file = files.find((f) => f._id.toString() === v.fileId.toString());
            if (file) {
                const url = file.getUrl();
                v.photo = {
                    thumbnails: file.getThumbnails(),
                    url: jwToken ? `${url}?photoId=${v._id}&token=${jwToken}` : url || null,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                };
            }
        });
        return {
            data: photos,
            total
        };
    }
};
PhotoSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(1, common_1.Inject(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        mongoose_1.Model,
        gallery_service_1.GalleryService,
        services_2.FileService])
], PhotoSearchService);
exports.PhotoSearchService = PhotoSearchService;
//# sourceMappingURL=photo-search.service.js.map