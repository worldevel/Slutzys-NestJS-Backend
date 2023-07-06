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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../kernel/constants");
const providers_1 = require("../../performer-assets/providers");
const models_1 = require("../../performer-assets/models");
const services_1 = require("../../block/services");
const providers_2 = require("../../performer/providers");
let SearchService = class SearchService {
    constructor(performerBlockService, galleryModel, productModel, videoModel, performerModel) {
        this.performerBlockService = performerBlockService;
        this.galleryModel = galleryModel;
        this.productModel = productModel;
        this.videoModel = videoModel;
        this.performerModel = performerModel;
    }
    async countTotal(req, countryCode) {
        const query = {
            status: constants_1.STATUS.ACTIVE
        };
        if (req.q) {
            const searchValue = { $regex: new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i') };
            query.$or = [
                { name: searchValue },
                { username: searchValue },
                { title: searchValue },
                { tags: { $elemMatch: searchValue } }
            ];
        }
        if (countryCode) {
            const blockCountries = await this.performerBlockService.findBlockCountriesByQuery({ countryCodes: { $in: [countryCode] } });
            const performerIds = blockCountries.map((b) => b.sourceId);
            if (performerIds.length > 0) {
                query._id = { $nin: performerIds };
            }
        }
        const [totalPerformers, totalVideos, totalGalleries, totalProducts] = await Promise.all([
            this.performerModel.countDocuments(query),
            this.videoModel.countDocuments(query),
            this.galleryModel.countDocuments(query),
            this.productModel.countDocuments(query)
        ]);
        return {
            totalPerformers, totalVideos, totalGalleries, totalProducts
        };
    }
};
SearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerBlockService))),
    __param(1, common_1.Inject(providers_1.PERFORMER_GALLERY_MODEL_PROVIDER)),
    __param(2, common_1.Inject(providers_1.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __param(3, common_1.Inject(providers_1.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __param(4, common_1.Inject(providers_2.PERFORMER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerBlockService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map