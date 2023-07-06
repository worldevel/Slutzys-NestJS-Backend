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
var SettingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
const constants_1 = require("../constants");
const menu_service_1 = require("./menu.service");
let SettingService = SettingService_1 = class SettingService {
    constructor(settingModel, queueEventService, menuService) {
        this.settingModel = settingModel;
        this.queueEventService = queueEventService;
        this.menuService = menuService;
        this.queueEventService.subscribe(constants_1.SETTING_CHANNEL, 'HANDLE_SETTINGS_CHANGE', this.subscribeChange.bind(this));
    }
    async publishChange(setting) {
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_1.SETTING_CHANNEL,
            eventName: 'update',
            data: new dtos_1.SettingDto(setting)
        }));
    }
    async subscribeChange() {
        await this.syncCache();
    }
    async syncCache() {
        const settings = await this.settingModel.find();
        settings.forEach((setting) => {
            const dto = new dtos_1.SettingDto(setting);
            SettingService_1._settingCache[dto.key] = dto;
            if (dto.visible && dto.public) {
                SettingService_1._publicSettingsCache[dto.key] = dto.value;
            }
        });
    }
    async get(key) {
        if (SettingService_1._settingCache[key]) {
            return SettingService_1._settingCache[key];
        }
        const data = await this.settingModel.findOne({ key });
        if (!data) {
            return null;
        }
        const dto = new dtos_1.SettingDto(data);
        SettingService_1._settingCache[key] = dto;
        return dto;
    }
    async getKeyValue(key) {
        if (SettingService_1._settingCache[key]) {
            return SettingService_1._settingCache[key].value;
        }
        const data = await this.settingModel.findOne({ key });
        if (!data) {
            return null;
        }
        const dto = new dtos_1.SettingDto(data);
        SettingService_1._settingCache[key] = dto;
        return dto.value;
    }
    async create(data) {
        const setting = await this.get(data.key);
        if (setting) {
            throw new common_1.HttpException('Setting key exist', 400);
        }
        await this.syncCache();
        return this.settingModel.create(data);
    }
    async update(key, data) {
        const setting = await this.settingModel.findOne({ key });
        if (!setting) {
            throw new kernel_1.EntityNotFoundException();
        }
        data.description && setting.set('description', data.description);
        data.name && setting.set('name', data.name);
        setting.set('value', data.value);
        await setting.save();
        const dto = new dtos_1.SettingDto(setting);
        await this.publishChange(dto);
        return dto;
    }
    async getPublicSettings() {
        const menus = await this.getPublicMenus();
        SettingService_1._publicSettingsCache.menus = menus && menus.length ? menus : [];
        return SettingService_1._publicSettingsCache;
    }
    async getPublicMenus() {
        return this.menuService.getPublicMenus();
    }
    async getEditableSettings(group) {
        const query = { editable: true };
        if (group) {
            query.group = group;
        }
        const settings = await this.settingModel.find(query).sort({ ordering: 'asc' });
        return settings.map((s) => new dtos_1.SettingDto(s));
    }
    static getByKey(key) {
        return SettingService_1._settingCache[key] || null;
    }
    static getValueByKey(key) {
        return SettingService_1._settingCache[key] ? SettingService_1._settingCache[key].value : null;
    }
};
SettingService._settingCache = {};
SettingService._publicSettingsCache = {};
SettingService = SettingService_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.SETTING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService,
        menu_service_1.MenuService])
], SettingService);
exports.SettingService = SettingService;
//# sourceMappingURL=setting.service.js.map