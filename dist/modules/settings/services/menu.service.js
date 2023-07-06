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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const providers_1 = require("../providers");
const models_1 = require("../models");
const dtos_1 = require("../dtos");
let MenuService = class MenuService {
    constructor(menuModel) {
        this.menuModel = menuModel;
    }
    async findById(id) {
        const query = { _id: id };
        const menu = await this.menuModel.findOne(query);
        if (!menu)
            return null;
        return menu;
    }
    async create(payload) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        const menu = await this.menuModel.create(data);
        return new dtos_1.MenuDto(menu);
    }
    async update(id, payload) {
        const menu = await this.findById(id);
        if (!menu) {
            throw new common_1.NotFoundException();
        }
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date() });
        return this.menuModel.updateOne({ _id: id }, data);
    }
    async delete(id) {
        const menu = id instanceof models_1.MenuModel ? id : await this.findById(id);
        if (!menu) {
            throw new common_1.NotFoundException('Menu not found');
        }
        await this.menuModel.deleteOne({ _id: id });
        return true;
    }
    async search(req) {
        const query = {};
        if (req.q) {
            query.$or = [
                {
                    title: { $regex: new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i') }
                }
            ];
        }
        if (req.section) {
            query.section = req.section;
        }
        let sort = { ordering: 1, createdAt: -1 };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.menuModel
                .find(query)
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.menuModel.countDocuments(query)
        ]);
        return {
            data: data.map((item) => new dtos_1.MenuDto(item)),
            total
        };
    }
    async userSearch(req) {
        const query = {};
        query.public = true;
        if (req.section) {
            query.section = req.section;
        }
        let sort = { ordering: 1, createdAt: -1 };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.menuModel
                .find(query)
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.menuModel.countDocuments(query)
        ]);
        return {
            data: data.map((item) => new dtos_1.MenuDto(item)),
            total
        };
    }
    async getPublicMenus() {
        return this.menuModel.find({}).sort({ ordering: 1, createdAt: -1 });
    }
};
MenuService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.MENU_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], MenuService);
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map