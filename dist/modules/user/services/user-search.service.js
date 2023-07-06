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
exports.UserSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const common_2 = require("../../../kernel/common");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
const constants_1 = require("../constants");
let UserSearchService = class UserSearchService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async search(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                },
                {
                    username: { $regex: regexp }
                },
                {
                    email: { $regex: regexp }
                }
            ];
        }
        if (req.role) {
            query.roles = { $in: [req.role] };
        }
        if (req.status) {
            query.status = req.status;
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
            this.userModel
                .find(query)
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.userModel.countDocuments(query)
        ]);
        return {
            data: data.map((item) => new dtos_1.UserDto(item).toResponse(true)),
            total
        };
    }
    async performerSearch(req) {
        const query = {
            status: constants_1.STATUS_ACTIVE,
            roles: { $ne: constants_1.ROLE_ADMIN }
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
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.userModel
                .find(query)
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.userModel.countDocuments(query)
        ]);
        return {
            data: data.map((d) => new dtos_1.UserDto(d).toResponse()),
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
            this.userModel
                .find(query)
        ]);
        return data;
    }
};
UserSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.USER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UserSearchService);
exports.UserSearchService = UserSearchService;
//# sourceMappingURL=user-search.service.js.map