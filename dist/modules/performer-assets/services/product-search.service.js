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
exports.ProductSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const services_2 = require("../../file/services");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const lodash_1 = require("lodash");
const constants_1 = require("../../../kernel/constants");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_3 = require("../../payment/services");
const constants_2 = require("../../payment/constants");
const services_4 = require("../../category/services");
const providers_1 = require("../providers");
const dtos_3 = require("../dtos");
let ProductSearchService = class ProductSearchService {
    constructor(categoryService, performerService, orderService, productModel, fileService) {
        this.categoryService = categoryService;
        this.performerService = performerService;
        this.orderService = orderService;
        this.productModel = productModel;
        this.fileService = fileService;
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
        if (req.categoryId)
            query.categoryIds = { $in: [req.categoryId] };
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.status)
            query.status = req.status;
        if (req.type)
            query.type = req.type;
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.productModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.productModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const imageIds = lodash_1.flatMap(data, (d) => d.imageIds);
        const categoryIds = lodash_1.flatMap(data, (d) => d.categoryIds);
        const products = data.map((v) => new dtos_3.ProductDto(v));
        const [performers, images, categories] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            imageIds.length ? this.fileService.findByIds(imageIds) : [],
            this.categoryService.findByIds(categoryIds)
        ]);
        products.forEach((v) => {
            var _a, _b;
            const stringImageIds = ((_a = v.imageIds) === null || _a === void 0 ? void 0 : _a.map((p) => p.toString())) || [];
            const files = images.filter((file) => stringImageIds.includes(file._id.toString()));
            if (files) {
                v.images = files.length ? files.map((f) => (Object.assign(Object.assign({}, f), { url: f.getUrl(), thumbnails: f.getThumbnails() }))) : [];
            }
            const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = new dtos_2.PerformerDto(performer).toResponse();
            }
            const stringCategoryIds = ((_b = v.categoryIds) === null || _b === void 0 ? void 0 : _b.map((p) => p.toString())) || [];
            v.categories = categories.filter((c) => stringCategoryIds.includes(c._id.toString()));
        });
        return {
            data: products,
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
        if (req.categoryId)
            query.categoryIds = { $in: [req.categoryId] };
        if (req.status)
            query.status = req.status;
        if (req.type)
            query.type = req.type;
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.productModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.productModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const imageIds = lodash_1.flatMap(data, (d) => d.imageIds);
        const categoryIds = lodash_1.flatMap(data, (d) => d.categoryIds);
        const products = data.map((v) => new dtos_3.ProductDto(v));
        const [performers, images, categories] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            imageIds.length ? this.fileService.findByIds(imageIds) : [],
            this.categoryService.findByIds(categoryIds)
        ]);
        products.forEach((v) => {
            var _a, _b;
            const stringImageIds = ((_a = v.imageIds) === null || _a === void 0 ? void 0 : _a.map((p) => p.toString())) || [];
            const files = images.filter((file) => stringImageIds.includes(file._id.toString()));
            if (files) {
                v.images = files.length ? files.map((f) => (Object.assign(Object.assign({}, f), { url: f.getUrl(), thumbnails: f.getThumbnails() }))) : [];
            }
            const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = new dtos_2.PerformerDto(performer).toResponse();
            }
            const stringCategoryIds = ((_b = v.categoryIds) === null || _b === void 0 ? void 0 : _b.map((p) => p.toString())) || [];
            v.categories = categories.filter((c) => stringCategoryIds.includes(c._id.toString()));
        });
        return {
            data: products,
            total
        };
    }
    async userSearch(req, user) {
        const query = {
            status: constants_1.STATUS.ACTIVE
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
        if (req.type)
            query.type = req.type;
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.excludedId && string_helper_1.isObjectId(req.excludedId))
            query._id = { $ne: req.excludedId };
        if (req.excludedId && !string_helper_1.isObjectId(req.excludedId))
            query.slug = { $ne: req.excludedId };
        if (req.includedIds)
            query._id = { $in: req.includedIds };
        if (req.categoryId)
            query.categoryIds = { $in: [req.categoryId] };
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.productModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.productModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const imageIds = lodash_1.flatMap(data, (d) => d.imageIds);
        const categoryIds = lodash_1.flatMap(data, (d) => d.categoryIds);
        const productIds = data.map((d) => d._id);
        const products = data.map((v) => new dtos_3.ProductDto(v));
        const [performers, images, transactions, categories] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            imageIds.length ? this.fileService.findByIds(imageIds) : [],
            user && user._id ? this.orderService.findDetailsByQuery({
                buyerId: user._id,
                productId: { $in: productIds },
                status: constants_2.ORDER_STATUS.PAID
            }) : [],
            this.categoryService.findByIds(categoryIds)
        ]);
        products.forEach((v) => {
            var _a, _b;
            const stringImageIds = ((_a = v.imageIds) === null || _a === void 0 ? void 0 : _a.map((p) => p.toString())) || [];
            const files = images.filter((file) => stringImageIds.includes(file._id.toString()));
            if (files) {
                v.images = files.length ? files.map((f) => (Object.assign(Object.assign({}, f), { url: f.getUrl(), thumbnails: f.getThumbnails() }))) : [];
            }
            const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = new dtos_2.PerformerDto(performer).toResponse();
            }
            const isBought = transactions.find((t) => `${t.productId}` === `${v._id}`);
            v.isBought = !!isBought;
            if ((user && `${user._id}` === `${v.performerId}`) || (user && user.roles && user.roles.includes('admin'))) {
                v.isBought = true;
            }
            const stringCategoryIds = ((_b = v.categoryIds) === null || _b === void 0 ? void 0 : _b.map((p) => p.toString())) || [];
            v.categories = categories.filter((c) => stringCategoryIds.includes(c._id.toString()));
        });
        return {
            data: products,
            total
        };
    }
};
ProductSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_4.CategoryService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_3.OrderService))),
    __param(3, common_1.Inject(providers_1.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_4.CategoryService,
        services_1.PerformerService,
        services_3.OrderService,
        mongoose_1.Model,
        services_2.FileService])
], ProductSearchService);
exports.ProductSearchService = ProductSearchService;
//# sourceMappingURL=product-search.service.js.map