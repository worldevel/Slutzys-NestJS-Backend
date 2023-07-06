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
exports.PerformerSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const common_2 = require("../../../kernel/common");
const moment = require("moment");
const services_1 = require("../../block/services");
const dtos_1 = require("../../user/dtos");
const providers_1 = require("../providers");
const dtos_2 = require("../dtos");
const constants_1 = require("../constants");
let PerformerSearchService = class PerformerSearchService {
    constructor(performerBlockService, performerModel) {
        this.performerBlockService = performerBlockService;
        this.performerModel = performerModel;
    }
    async adminSearch(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    firstName: { $regex: regexp }
                },
                {
                    lastName: { $regex: regexp }
                },
                {
                    name: { $regex: regexp }
                },
                {
                    email: { $regex: regexp }
                },
                {
                    username: { $regex: regexp }
                }
            ];
        }
        if (req.performerIds) {
            query._id = Array.isArray(req.performerIds) ? { $in: req.performerIds } : { $in: [req.performerIds] };
        }
        if (req.status) {
            query.status = req.status;
        }
        if (req.gender) {
            query.gender = req.gender;
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
            this.performerModel
                .find(query)
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.performerModel.countDocuments(query)
        ]);
        return {
            data: data.map((item) => new dtos_2.PerformerDto(item)),
            total
        };
    }
    async search(req, user, countryCode) {
        const query = {
            status: constants_1.PERFORMER_STATUSES.ACTIVE
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                },
                {
                    username: { $regex: regexp }
                }
            ];
        }
        [
            'hair',
            'pubicHair',
            'ethnicity',
            'country',
            'bodyType',
            'gender',
            'height',
            'weight',
            'eyes',
            'butt',
            'agentId',
            'sexualPreference'
        ].forEach((f) => {
            if (req[f]) {
                query[f] = req[f];
            }
        });
        if (user) {
            query._id = { $ne: user._id };
        }
        if (req.performerIds) {
            query._id = Array.isArray(req.performerIds) ? { $in: req.performerIds } : { $in: [req.performerIds] };
        }
        if (req.age) {
            const fromAge = req.age.split('_')[0];
            const toAge = req.age.split('_')[1];
            const fromDate = moment().subtract(toAge, 'years').startOf('day').toDate();
            const toDate = moment().subtract(fromAge, 'years').startOf('day').toDate();
            query.dateOfBirth = {
                $gte: fromDate,
                $lte: toDate
            };
        }
        if (req.gender) {
            query.gender = req.gender;
        }
        if (countryCode) {
            const blockCountries = await this.performerBlockService.findBlockCountriesByQuery({ countryCodes: { $in: [countryCode] } });
            const performerIds = blockCountries.map((b) => b.sourceId);
            if (performerIds.length > 0) {
                query._id = { $nin: performerIds };
            }
        }
        let sort = {
            createdAt: -1
        };
        if (req.sortBy === 'latest') {
            sort = '-createdAt';
        }
        if (req.sortBy === 'oldest') {
            sort = 'createdAt';
        }
        if (req.sortBy === 'popular') {
            sort = '-score';
        }
        if (req.sortBy === 'subscriber') {
            sort = '-stats.subscribers';
        }
        const [data, total] = await Promise.all([
            this.performerModel
                .find(query)
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.performerModel.countDocuments(query)
        ]);
        return {
            data: data.map((item) => new dtos_2.PerformerDto(item).toResponse()),
            total
        };
    }
    async searchByKeyword(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                },
                {
                    email: { $regex: regexp }
                },
                {
                    username: { $regex: regexp }
                }
            ];
        }
        const [data] = await Promise.all([
            this.performerModel
                .find(query)
        ]);
        return data;
    }
};
PerformerSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerBlockService))),
    __param(1, common_1.Inject(providers_1.PERFORMER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerBlockService,
        mongoose_1.Model])
], PerformerSearchService);
exports.PerformerSearchService = PerformerSearchService;
//# sourceMappingURL=performer-search.service.js.map