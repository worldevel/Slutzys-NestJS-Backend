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
exports.BannerService = exports.BANNER_CHANNEL = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../../file/services");
const lodash_1 = require("lodash");
const constants_1 = require("../../file/constants");
const constants_2 = require("../constants");
const dtos_2 = require("../dtos");
const providers_1 = require("../providers");
exports.BANNER_CHANNEL = 'BANNER_CHANNEL';
let BannerService = class BannerService {
    constructor(bannerModel, fileService) {
        this.bannerModel = bannerModel;
        this.fileService = fileService;
    }
    async create(file, payload, creator) {
        if (!file)
            throw new common_1.HttpException('File is valid!', 400);
        if (!file.isImage()) {
            await this.fileService.removeIfNotHaveRef(file._id);
            throw new common_1.HttpException('Invalid image!', 400);
        }
        const banner = new this.bannerModel(payload);
        if (!banner.title)
            banner.title = file.name;
        banner.fileId = file._id;
        banner.createdAt = new Date();
        banner.updatedAt = new Date();
        if (creator) {
            banner.createdBy = creator._id;
            banner.updatedBy = creator._id;
        }
        await banner.save();
        await Promise.all([
            this.fileService.addRef(file._id, {
                itemType: constants_1.REF_TYPE.BANNER,
                itemId: banner._id
            })
        ]);
        const dto = new dtos_2.BannerDto(banner);
        return dto;
    }
    async updateInfo(id, payload, updater) {
        const banner = await this.bannerModel.findById(id);
        if (!banner) {
            throw new kernel_1.EntityNotFoundException();
        }
        lodash_1.merge(banner, payload);
        if (banner.status !== constants_2.BANNER_STATUS.FILE_ERROR
            && payload.status !== constants_2.BANNER_STATUS.FILE_ERROR) {
            banner.status = payload.status;
        }
        updater && banner.set('updatedBy', updater._id);
        banner.updatedAt = new Date();
        await banner.save();
        const dto = new dtos_2.BannerDto(banner);
        return dto;
    }
    async details(id) {
        const banner = await this.bannerModel.findOne({ _id: id });
        if (!banner) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_2.BannerDto(banner);
        const [file] = await Promise.all([
            banner.fileId ? this.fileService.findById(banner.fileId) : null
        ]);
        if (file) {
            dto.photo = {
                url: file.getUrl(),
                thumbnails: file.getThumbnails(),
                width: file.width,
                height: file.height
            };
        }
        return dto;
    }
    async delete(id) {
        const banner = await this.bannerModel.findById(id);
        if (!banner) {
            throw new kernel_1.EntityNotFoundException();
        }
        await banner.remove();
        await this.fileService.remove(banner.fileId);
        return true;
    }
};
BannerService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.BANNER_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.FileService])
], BannerService);
exports.BannerService = BannerService;
//# sourceMappingURL=banner.service.js.map