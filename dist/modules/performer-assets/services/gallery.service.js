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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const reaction_service_1 = require("../../reaction/services/reaction.service");
const lodash_1 = require("lodash");
const services_2 = require("../../file/services");
const constants_1 = require("../../reaction/constants");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const constants_2 = require("../../../kernel/constants");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_3 = require("../../payment/services");
const constants_3 = require("../../payment/constants");
const contants_1 = require("../../comment/contants");
const dtos_3 = require("../dtos");
const providers_1 = require("../providers");
const photo_service_1 = require("./photo.service");
let GalleryService = class GalleryService {
    constructor(subscriptionService, performerService, reactionService, photoService, checkPaymentService, orderService, galleryModel, photoModel, fileService) {
        this.subscriptionService = subscriptionService;
        this.performerService = performerService;
        this.reactionService = reactionService;
        this.photoService = photoService;
        this.checkPaymentService = checkPaymentService;
        this.orderService = orderService;
        this.galleryModel = galleryModel;
        this.photoModel = photoModel;
        this.fileService = fileService;
    }
    async create(payload, creator) {
        if (payload.performerId) {
            const performer = await this.performerService.findById(payload.performerId);
            if (!performer) {
                throw new kernel_1.EntityNotFoundException('Performer not found!');
            }
        }
        const model = new this.galleryModel(payload);
        model.slug = kernel_1.StringHelper.createAlias(payload.name);
        const slugCheck = await this.galleryModel.countDocuments({
            slug: model.slug
        });
        if (slugCheck) {
            model.slug = `${model.slug}-${kernel_1.StringHelper.randomString(8)}`;
        }
        model.createdAt = new Date();
        model.updatedAt = new Date();
        if (creator) {
            if (!model.performerId) {
                model.performerId = creator._id;
            }
            model.createdBy = creator._id;
            model.updatedBy = creator._id;
        }
        await model.save();
        return dtos_3.GalleryDto.fromModel(model);
    }
    async update(id, payload, creator) {
        const gallery = await this.galleryModel.findById(id);
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException('Gallery not found!');
        }
        let { slug } = gallery;
        if (payload.name !== gallery.name) {
            slug = kernel_1.StringHelper.createAlias(payload.name);
            const slugCheck = await this.galleryModel.countDocuments({
                slug,
                _id: { $ne: gallery._id }
            });
            if (slugCheck) {
                slug = `${slug}-${kernel_1.StringHelper.randomString(8)}`;
            }
        }
        lodash_1.merge(gallery, payload);
        gallery.updatedAt = new Date();
        if (creator) {
            gallery.updatedBy = creator._id;
        }
        gallery.slug = slug;
        await gallery.save();
        return dtos_3.GalleryDto.fromModel(gallery);
    }
    async findByIds(ids) {
        const galleries = await this.galleryModel.find({
            _id: {
                $in: ids
            }
        });
        return galleries.map((g) => new dtos_3.GalleryDto(g));
    }
    async findById(id) {
        const gallery = await this.galleryModel.findOne({ _id: id });
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        return new dtos_3.GalleryDto(gallery);
    }
    async details(id, user) {
        const query = string_helper_1.isObjectId(id) ? { _id: id } : { slug: id };
        const gallery = await this.galleryModel.findOne(query);
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_3.GalleryDto(gallery);
        if (gallery.performerId) {
            const performer = await this.performerService.findById(gallery.performerId);
            dto.performer = performer ? new dtos_2.PerformerDto(performer).toPublicDetailsResponse() : null;
        }
        if (gallery.coverPhotoId) {
            const coverPhoto = await this.photoModel.findById(gallery.coverPhotoId);
            if (coverPhoto) {
                const file = await this.fileService.findById(coverPhoto.fileId);
                dto.coverPhoto = file ? {
                    url: file.getUrl(),
                    thumbnails: file.getThumbnails()
                } : null;
            }
        }
        const isLiked = user ? await this.reactionService.checkExisting(dto._id, user._id, constants_1.REACTION.LIKE, contants_1.OBJECT_TYPE.GALLERY) : null;
        dto.isLiked = !!isLiked;
        const subscribed = user && !gallery.isSale && await this.subscriptionService.checkSubscribed(dto.performerId, user._id);
        dto.isSubscribed = !!subscribed;
        const isBought = user && gallery.isSale && await this.checkPaymentService.checkBoughtGallery(dto, user);
        dto.isBought = !!isBought;
        if (user && user.roles && user.roles.includes('admin')) {
            dto.isSubscribed = true;
            dto.isBought = true;
        }
        await this.galleryModel.updateOne({ _id: gallery._id }, { $inc: { 'stats.views': 1 } });
        return dto;
    }
    async updatePhotoStats(id, num = 1) {
        return this.galleryModel.findOneAndUpdate({ _id: id }, {
            $inc: { numOfItems: num }
        });
    }
    async downloadZipPhotos(galleryId, user) {
        const gallery = await this.galleryModel.findOne({ _id: galleryId });
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!gallery.isSale) {
            const isSubscribed = await this.subscriptionService.checkSubscribed(gallery.performerId, user._id);
            if (!isSubscribed)
                throw new common_1.HttpException('Please subscribe model before downloading', 403);
        }
        if (gallery.isSale) {
            const isBought = await this.checkPaymentService.checkBoughtGallery(new dtos_3.GalleryDto(gallery), user);
            if (!isBought)
                throw new common_1.HttpException('Please unlock gallery before downloading', 403);
        }
        const photos = await this.photoModel.find({ galleryId });
        const fileIds = photos.map((d) => d.fileId);
        const files = await this.fileService.findByIds(fileIds);
        return files.map((f) => ({ path: f.getUrl(), name: f.name }));
    }
    async adminSearch(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                },
                {
                    description: { $regex: regexp }
                }
            ];
        }
        if (req.performerId)
            query.performerId = req.performerId;
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
            this.galleryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.galleryModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const galleries = data.map((g) => new dtos_3.GalleryDto(g));
        const coverPhotoIds = data.map((d) => d.coverPhotoId);
        const [performers, coverPhotos] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            coverPhotoIds.length
                ? this.photoModel
                    .find({ _id: { $in: coverPhotoIds } })
                    .lean()
                    .exec()
                : []
        ]);
        const fileIds = coverPhotos.map((c) => c.fileId);
        const files = await this.fileService.findByIds(fileIds);
        galleries.forEach((g) => {
            const performer = performers.find((p) => p._id.toString() === g.performerId.toString());
            if (performer) {
                g.performer = new dtos_2.PerformerDto(performer).toPublicDetailsResponse();
            }
            if (g.coverPhotoId) {
                const coverPhoto = coverPhotos.find((c) => c._id.toString() === g.coverPhotoId.toString());
                if (coverPhoto) {
                    const file = files.find((f) => f._id.toString() === coverPhoto.fileId.toString());
                    if (file) {
                        g.coverPhoto = {
                            url: file.getUrl(),
                            thumbnails: file.getThumbnails()
                        };
                    }
                }
            }
        });
        return {
            data: galleries,
            total
        };
    }
    async performerSearch(req, user) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                },
                {
                    description: { $regex: regexp }
                }
            ];
        }
        query.performerId = user._id;
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
            this.galleryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.galleryModel.countDocuments(query)
        ]);
        const galleries = data.map((g) => new dtos_3.GalleryDto(g));
        const coverPhotoIds = data.map((d) => d.coverPhotoId);
        const [coverPhotos] = await Promise.all([
            coverPhotoIds.length
                ? this.photoModel
                    .find({ _id: { $in: coverPhotoIds } })
                    .lean()
                    .exec()
                : []
        ]);
        const fileIds = coverPhotos.map((c) => c.fileId);
        const files = await this.fileService.findByIds(fileIds);
        galleries.forEach((g) => {
            if (g.coverPhotoId) {
                const coverPhoto = coverPhotos.find((c) => c._id.toString() === g.coverPhotoId.toString());
                if (coverPhoto) {
                    const file = files.find((f) => f._id.toString() === coverPhoto.fileId.toString());
                    if (file) {
                        g.coverPhoto = {
                            url: file.getUrl(),
                            thumbnails: file.getThumbnails()
                        };
                    }
                }
            }
        });
        return {
            data: galleries,
            total
        };
    }
    async userSearch(req, user) {
        const query = {
            status: constants_2.STATUS.ACTIVE,
            numOfItems: { $gt: 0 }
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                },
                {
                    description: { $regex: regexp }
                }
            ];
        }
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.excludedId) {
            query._id = { $ne: req.excludedId };
        }
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.galleryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.galleryModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const galleries = data.map((g) => new dtos_3.GalleryDto(g));
        const coverPhotoIds = data.map((d) => d.coverPhotoId);
        const galleryIds = data.map((d) => d._id);
        const [performers, coverPhotos, subscriptions, transactions] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            coverPhotoIds.length
                ? this.photoModel
                    .find({ _id: { $in: coverPhotoIds } })
                    .lean()
                    .exec()
                : [],
            user && user._id ? this.subscriptionService.findSubscriptionList({
                userId: user._id, performerId: { $in: performerIds }, expiredAt: { $gt: new Date() }
            }) : [],
            user && user._id ? this.orderService.findDetailsByQuery({
                buyerId: user._id,
                productId: { $in: galleryIds },
                status: constants_3.ORDER_STATUS.PAID
            }) : []
        ]);
        const fileIds = coverPhotos.map((c) => c.fileId);
        const files = await this.fileService.findByIds(fileIds);
        galleries.forEach((g) => {
            const performer = performers.find((p) => p._id.toString() === g.performerId.toString());
            g.performer = performer ? new dtos_2.PerformerDto(performer).toPublicDetailsResponse() : null;
            const subscribed = subscriptions.find((s) => `${s.performerId}` === `${g.performerId}`);
            g.isSubscribed = !!subscribed;
            const isBought = transactions.find((t) => `${t.productId}` === `${g._id}`);
            g.isBought = !!isBought;
            if (g.coverPhotoId) {
                const coverPhoto = coverPhotos.find((c) => c._id.toString() === g.coverPhotoId.toString());
                if (coverPhoto) {
                    const file = files.find((f) => f._id.toString() === coverPhoto.fileId.toString());
                    if (file) {
                        g.coverPhoto = {
                            url: file.getUrl(),
                            thumbnails: file.getThumbnails()
                        };
                    }
                }
            }
            if ((user && `${user._id}` === `${g.performerId}`) || (user && user.roles && user.roles.includes('admin'))) {
                g.isSubscribed = true;
                g.isBought = true;
            }
        });
        return {
            data: galleries,
            total
        };
    }
    async updateCover(galleryId, photoId) {
        await this.galleryModel.updateOne({ _id: galleryId }, {
            coverPhotoId: photoId
        });
        return true;
    }
    async delete(id) {
        const gallery = await this.galleryModel.findById(id);
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        await gallery.remove();
        await this.photoService.deleteByGallery(gallery._id);
        return true;
    }
    async updateCommentStats(id, num = 1) {
        return this.galleryModel.updateOne({ _id: id }, {
            $inc: { 'stats.comments': num }
        });
    }
    async updateLikeStats(id, num = 1) {
        return this.galleryModel.updateOne({ _id: id }, {
            $inc: { 'stats.likes': num }
        });
    }
};
GalleryService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => subscription_service_1.SubscriptionService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => reaction_service_1.ReactionService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => photo_service_1.PhotoService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_3.CheckPaymentService))),
    __param(5, common_1.Inject(common_1.forwardRef(() => services_3.OrderService))),
    __param(6, common_1.Inject(providers_1.PERFORMER_GALLERY_MODEL_PROVIDER)),
    __param(7, common_1.Inject(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        services_1.PerformerService,
        reaction_service_1.ReactionService,
        photo_service_1.PhotoService,
        services_3.CheckPaymentService,
        services_3.OrderService,
        mongoose_1.Model,
        mongoose_1.Model,
        services_2.FileService])
], GalleryService);
exports.GalleryService = GalleryService;
//# sourceMappingURL=gallery.service.js.map