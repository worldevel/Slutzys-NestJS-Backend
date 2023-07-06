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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const lodash_1 = require("lodash");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../user/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let CategoryService = class CategoryService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async findByIds(ids) {
        return this.categoryModel.find({ _id: { $in: ids } });
    }
    async create(payload, creator) {
        const data = Object.assign(Object.assign({}, payload), { createdBy: creator._id, updatedBy: creator._id, createdAt: new Date(), updatedAt: new Date() });
        data.slug = kernel_1.StringHelper.createAlias(data.name);
        const slugCheck = await this.categoryModel.countDocuments({
            slug: data.slug
        });
        if (slugCheck) {
            data.slug = `${data.slug}-${kernel_1.StringHelper.randomString(8)}`;
        }
        return this.categoryModel.create(data);
    }
    async update(id, payload, creator) {
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new kernel_1.EntityNotFoundException('Category not found!');
        }
        let { slug } = category;
        if (payload.name !== category.name) {
            slug = kernel_1.StringHelper.createAlias(payload.name);
            const slugCheck = await this.categoryModel.countDocuments({
                slug,
                _id: { $ne: category._id }
            });
            if (slugCheck) {
                slug = `${slug}-${kernel_1.StringHelper.randomString(8)}`;
            }
        }
        lodash_1.merge(category, payload);
        category.slug = slug;
        category.updatedAt = new Date();
        if (creator) {
            category.updatedBy = creator._id;
        }
        return category.save();
    }
    async findByIdOrAlias(id) {
        const query = !string_helper_1.isObjectId(`${id}`) ? { slug: id } : { _id: id };
        const category = await this.categoryModel.findOne(query);
        if (!category) {
            throw new kernel_1.EntityNotFoundException();
        }
        return category;
    }
    async search(req) {
        const query = {};
        if (req.q)
            query.name = { $regex: new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i') };
        if (req.status)
            query.status = req.status;
        if (req.group) {
            query.group = { $nin: constants_1.CATEGORY_GROUPS.filter((c) => c !== req.group) };
        }
        let sort = {
            ordering: 1,
            updatedAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.categoryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.categoryModel.countDocuments(query)
        ]);
        return {
            data,
            total
        };
    }
    async delete(id) {
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new kernel_1.EntityNotFoundException();
        }
        await category.remove();
        return true;
    }
};
CategoryService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.CATEGORY_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map