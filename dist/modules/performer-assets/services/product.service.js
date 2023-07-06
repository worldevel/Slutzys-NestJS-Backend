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
exports.ProductService = exports.PERFORMER_COUNT_PRODUCT_CHANNEL = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const file_1 = require("../../file");
const services_1 = require("../../file/services");
const services_2 = require("../../performer/services");
const lodash_1 = require("lodash");
const constants_1 = require("../../../kernel/constants");
const dtos_1 = require("../../user/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_3 = require("../../auth/services");
const services_4 = require("../../payment/services");
const constants_2 = require("../../file/constants");
const dtos_2 = require("../../performer/dtos");
const services_5 = require("../../category/services");
const constants_3 = require("../constants");
const dtos_3 = require("../dtos");
const exceptions_1 = require("../exceptions");
const providers_1 = require("../providers");
exports.PERFORMER_COUNT_PRODUCT_CHANNEL = 'PERFORMER_COUNT_PRODUCT_CHANNEL';
let ProductService = class ProductService {
    constructor(categoryService, authService, performerService, checkPaymentService, productModel, fileService, queueEventService) {
        this.categoryService = categoryService;
        this.authService = authService;
        this.performerService = performerService;
        this.checkPaymentService = checkPaymentService;
        this.productModel = productModel;
        this.fileService = fileService;
        this.queueEventService = queueEventService;
    }
    async findByIds(ids) {
        const productIds = lodash_1.uniq(ids.map((i) => i.toString()));
        const products = await this.productModel
            .find({
            _id: {
                $in: productIds
            }
        })
            .lean()
            .exec();
        return products.map((p) => new dtos_3.ProductDto(p));
    }
    async findById(id) {
        const data = await this.productModel.findById(id);
        return data;
    }
    async validatePhoto(photo) {
        if (!photo.isImage()) {
            await this.fileService.remove(photo._id);
            throw new common_1.HttpException('Invalid photo file!', 422);
        }
        await this.fileService.queueProcessPhoto(photo._id, {
            thumbnailSize: {
                width: 500,
                height: 500
            }
        });
        return true;
    }
    async create(payload, digitalFile, creator) {
        if (payload.type === constants_3.PRODUCT_TYPE.DIGITAL && !digitalFile) {
            throw new exceptions_1.InvalidFileException('Missing digital file');
        }
        const product = new this.productModel(payload);
        if (digitalFile)
            product.digitalFileId = digitalFile._id;
        if (creator) {
            product.createdBy = creator._id;
            product.updatedBy = creator._id;
        }
        product.categoryIds = payload.categoryIds || [];
        product.createdAt = new Date();
        product.updatedAt = new Date();
        product.slug = kernel_1.StringHelper.createAlias(payload.name);
        const slugCheck = await this.productModel.countDocuments({
            slug: product.slug
        });
        if (slugCheck) {
            product.slug = `${product.slug}-${kernel_1.StringHelper.randomString(8)}`;
        }
        await product.save();
        product.imageIds && await Promise.all(product.imageIds.map((id) => this.fileService.addRef(id, { itemId: product._id, itemType: constants_2.REF_TYPE.PRODUCT })));
        product.digitalFileId && await this.fileService.addRef(product.digitalFileId, { itemId: product._id, itemType: constants_2.REF_TYPE.PRODUCT });
        const dto = new dtos_3.ProductDto(product);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_COUNT_PRODUCT_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: dto
        }));
        return dto;
    }
    async update(id, payload, digitalFile, updater) {
        const product = await this.productModel.findOne({ _id: id });
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        const oldStatus = product.status;
        if (payload.type === constants_3.PRODUCT_TYPE.DIGITAL
            && !product.digitalFileId && !digitalFile) {
            throw new exceptions_1.InvalidFileException('Missing digital file');
        }
        let { slug } = product;
        if (payload.name !== product.name) {
            slug = kernel_1.StringHelper.createAlias(payload.name);
            const slugCheck = await this.productModel.countDocuments({
                slug,
                _id: { $ne: product._id }
            });
            if (slugCheck) {
                slug = `${slug}-${kernel_1.StringHelper.randomString(8)}`;
            }
        }
        lodash_1.merge(product, payload);
        product.categoryIds = payload.categoryIds || [];
        product.imageIds = payload.imageIds || [];
        product.slug = slug;
        if (digitalFile && `${digitalFile._id}` !== `${product === null || product === void 0 ? void 0 : product.digitalFileId}`) {
            await this.fileService.addRef(product.digitalFileId, { itemId: product._id, itemType: constants_2.REF_TYPE.PRODUCT });
        }
        const deletedFileIds = [];
        if (payload.imageIds && payload.imageIds.length && product.imageIds) {
            const differentIds = lodash_1.xor(Array.isArray(payload.imageIds) ? payload.imageIds.map((imgId) => string_helper_1.toObjectId(imgId)) : [string_helper_1.toObjectId(payload.imageIds)], product.imageIds);
            differentIds && await Promise.all(differentIds.map((imgId) => this.fileService.addRef(imgId, { itemId: product._id, itemType: constants_2.REF_TYPE.PRODUCT })));
        }
        if (digitalFile) {
            product.digitalFileId && deletedFileIds.push(product.digitalFileId);
            product.digitalFileId = digitalFile._id;
        }
        if (updater)
            product.updatedBy = updater._id;
        product.updatedAt = new Date();
        await product.save();
        deletedFileIds.length && (await Promise.all(deletedFileIds.map((fileId) => this.fileService.remove(fileId))));
        const dto = new dtos_3.ProductDto(product);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_COUNT_PRODUCT_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: Object.assign(Object.assign({}, dto), { oldStatus })
        }));
        return dto;
    }
    async delete(id) {
        const product = await this.productModel.findOne({ _id: id });
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        await product.remove();
        product.digitalFileId && (await this.fileService.remove(product.digitalFileId));
        product.imageIds && await Promise.all(product.imageIds.map((fileId) => this.fileService.remove(fileId)));
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_COUNT_PRODUCT_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new dtos_3.ProductDto(product)
        }));
        return true;
    }
    async getDetails(id) {
        var _a;
        const query = !string_helper_1.isObjectId(`${id}`) ? { slug: id } : { _id: id };
        const product = await this.productModel.findOne(query);
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [images, digitalFile] = await Promise.all([
            product.imageIds ? this.fileService.findByIds(product.imageIds) : [],
            product.digitalFileId && this.fileService.findById(product.digitalFileId)
        ]);
        const dto = new dtos_3.ProductDto(product);
        dto.images = images.length ? images.map((image) => (Object.assign(Object.assign({}, image), { url: image.getUrl(), thumbnails: image.getThumbnails() }))) : [];
        if (dto.type === constants_3.PRODUCT_TYPE.DIGITAL && digitalFile) {
            dto.digitalFile = digitalFile.getUrl();
        }
        if ((_a = product.categoryIds) === null || _a === void 0 ? void 0 : _a.length) {
            dto.categories = await this.categoryService.findByIds(product.categoryIds);
        }
        await this.productModel.updateOne({ _id: product._id }, { $inc: { 'stats.views': 1 } });
        return dto;
    }
    async userGetDetails(id) {
        var _a;
        const query = !string_helper_1.isObjectId(`${id}`) ? { slug: id } : { _id: id };
        const product = await this.productModel.findOne(query);
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [images, performer] = await Promise.all([
            product.imageIds ? this.fileService.findByIds(product.imageIds) : [],
            product.performerId && this.performerService.findById(product.performerId)
        ]);
        const dto = new dtos_3.ProductDto(product);
        dto.images = images.length ? images.map((image) => (Object.assign(Object.assign({}, image), { url: image.getUrl(), thumbnails: image.getThumbnails() }))) : [];
        dto.performer = performer ? new dtos_2.PerformerDto(performer).toResponse() : null;
        if ((_a = product.categoryIds) === null || _a === void 0 ? void 0 : _a.length) {
            dto.categories = await this.categoryService.findByIds(product.categoryIds);
        }
        await this.productModel.updateOne({ _id: product._id }, { $inc: { 'stats.views': 1 } });
        return dto;
    }
    async updateStock(id, num = -1) {
        return this.productModel.updateOne({ _id: id }, { $inc: { stock: num } });
    }
    async updateCommentStats(id, num = 1) {
        return this.productModel.updateOne({ _id: id }, {
            $inc: { 'stats.comments': num }
        });
    }
    async updateLikeStats(id, num = 1) {
        return this.productModel.updateOne({ _id: id }, {
            $inc: { 'stats.likes': num }
        });
    }
    async generateDownloadLink(productId, userId) {
        const product = await this.productModel.findById(productId);
        if (!product.digitalFileId)
            throw new kernel_1.EntityNotFoundException();
        const file = await this.fileService.findById(product.digitalFileId);
        if (!file)
            throw new kernel_1.EntityNotFoundException();
        const auth = await this.authService.findBySource({ source: 'user', type: 'email', sourceId: userId })
            || await this.authService.findBySource({ source: 'user', type: 'username', sourceId: userId });
        const jwToken = this.authService.generateJWT(lodash_1.pick(auth, ['_id', 'source', 'sourceId']), { expiresIn: 3 * 60 * 60 });
        return `${new file_1.FileDto(file).getUrl()}?productId=${product._id}&token=${jwToken}`;
    }
    async checkAuth(req, user) {
        const { query } = req;
        if (!query.productId) {
            throw new common_1.ForbiddenException();
        }
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        const product = await this.productModel.findById(query.productId);
        if (!product)
            throw new kernel_1.EntityNotFoundException();
        if (user._id.toString() === product.performerId.toString()) {
            return true;
        }
        const bought = await this.checkPaymentService.checkBoughtProduct(new dtos_3.ProductDto(product), user);
        if (!bought) {
            throw new common_1.ForbiddenException();
        }
        return true;
    }
};
ProductService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_5.CategoryService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_3.AuthService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_4.CheckPaymentService))),
    __param(4, common_1.Inject(providers_1.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_5.CategoryService,
        services_3.AuthService,
        services_2.PerformerService,
        services_4.CheckPaymentService,
        mongoose_1.Model,
        services_1.FileService,
        kernel_1.QueueEventService])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map