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
exports.PerformerBlockService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../../user/services");
const lodash_1 = require("lodash");
const mailer_1 = require("../../mailer");
const dtos_2 = require("../dtos");
const providers_1 = require("../providers");
let PerformerBlockService = class PerformerBlockService {
    constructor(userService, performerBlockCountryModel, blockedByPerformerModel, mailService) {
        this.userService = userService;
        this.performerBlockCountryModel = performerBlockCountryModel;
        this.blockedByPerformerModel = blockedByPerformerModel;
        this.mailService = mailService;
    }
    findBlockCountriesByQuery(query) {
        return this.performerBlockCountryModel.find(query);
    }
    findOneBlockCountriesByQuery(query) {
        return this.performerBlockCountryModel.findOne(query);
    }
    listByQuery(query) {
        return this.blockedByPerformerModel.find(query);
    }
    async checkBlockedCountryByIp(performerId, countryCode) {
        const blockCountries = await this.performerBlockCountryModel.findOne({
            sourceId: performerId
        });
        if (blockCountries
            && blockCountries.countryCodes
            && blockCountries.countryCodes.length) {
            return blockCountries.countryCodes.indexOf(countryCode) > -1;
        }
        return false;
    }
    async checkBlockedByPerformer(performerId, userId) {
        const blocked = await this.blockedByPerformerModel.countDocuments({
            sourceId: performerId,
            targetId: userId
        });
        return blocked > 0;
    }
    async performerBlockCountries(payload, user) {
        const { countryCodes } = payload;
        const item = await this.performerBlockCountryModel.findOne({
            sourceId: user._id
        });
        if (item) {
            return this.performerBlockCountryModel.updateOne({ sourceId: user._id }, { countryCodes });
        }
        return this.performerBlockCountryModel.create({
            source: 'performer',
            sourceId: user._id,
            countryCodes
        });
    }
    async blockUser(user, payload) {
        const blocked = await this.blockedByPerformerModel.findOne({
            sourceId: user._id,
            targetId: payload.targetId
        });
        if (blocked) {
            return blocked;
        }
        const newBlock = await this.blockedByPerformerModel.create(Object.assign(Object.assign({}, payload), { source: 'performer', sourceId: user._id, createdAt: new Date(), updatedAt: new Date() }));
        const target = await this.userService.findById(payload.targetId);
        (target === null || target === void 0 ? void 0 : target.email) && await this.mailService.send({
            subject: 'Model block',
            to: target.email,
            data: {
                userName: target.name || target.username || `${target.firstName} ${target.lastName}` || 'there',
                message: `${user.name || user.username || 'Model'} has blocked you`
            },
            template: 'block-user-notification'
        });
        return newBlock;
    }
    async unblockUser(user, targetId) {
        const blocked = await this.blockedByPerformerModel.findOne({
            sourceId: user._id,
            targetId
        });
        if (!blocked) {
            throw new kernel_1.EntityNotFoundException();
        }
        await blocked.remove();
        const target = await this.userService.findById(targetId);
        (target === null || target === void 0 ? void 0 : target.email) && await this.mailService.send({
            subject: 'Model unblock',
            to: target.email,
            data: {
                userName: target.name || target.username || `${target.firstName} ${target.lastName}` || 'there',
                message: `${user.name || user.username || 'Model'} has unblocked you`
            },
            template: 'block-user-notification'
        });
        return { unlocked: true };
    }
    async getBlockedUsers(user, req) {
        const query = {
            sourceId: user._id
        };
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy || 'updatedAt']: req.sort || -1
            };
        }
        const [data, total] = await Promise.all([
            this.blockedByPerformerModel
                .find(query)
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.blockedByPerformerModel.countDocuments(query)
        ]);
        const list = data.map((d) => new dtos_2.PerformerBlockUserDto(d));
        const targetIds = lodash_1.uniq(data.map((d) => d.targetId));
        const users = await this.userService.findByIds(targetIds);
        list.forEach((u) => {
            const info = users.find((s) => `${s._id}` === `${u.targetId}`);
            u.targetInfo = info ? new dtos_1.UserDto(info).toResponse() : null;
        });
        return {
            data: list,
            total
        };
    }
};
PerformerBlockService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.UserService))),
    __param(1, common_1.Inject(providers_1.PERFORMER_BLOCK_COUNTRY_PROVIDER)),
    __param(2, common_1.Inject(providers_1.PERFORMER_BLOCK_USER_PROVIDER)),
    __metadata("design:paramtypes", [services_1.UserService,
        mongoose_1.Model,
        mongoose_1.Model,
        mailer_1.MailerService])
], PerformerBlockService);
exports.PerformerBlockService = PerformerBlockService;
//# sourceMappingURL=performer-block.service.js.map