import { Model } from 'mongoose';
import { QueueEventService } from 'src/kernel';
import { SettingModel } from '../models';
import { SettingCreatePayload, SettingUpdatePayload } from '../payloads';
import { SettingDto } from '../dtos';
import { MenuService } from './menu.service';
export declare class SettingService {
    private readonly settingModel;
    private readonly queueEventService;
    private readonly menuService;
    static _settingCache: Map<string, any>;
    static _publicSettingsCache: any;
    constructor(settingModel: Model<SettingModel>, queueEventService: QueueEventService, menuService: MenuService);
    private publishChange;
    private subscribeChange;
    syncCache(): Promise<void>;
    get(key: string): Promise<SettingDto>;
    getKeyValue(key: string): Promise<any>;
    create(data: SettingCreatePayload): Promise<SettingModel>;
    update(key: string, data: SettingUpdatePayload): Promise<SettingDto>;
    getPublicSettings(): Promise<Map<string, any>>;
    getPublicMenus(): Promise<import("../models").MenuModel[]>;
    getEditableSettings(group?: string): Promise<SettingDto[]>;
    static getByKey(key: string): any;
    static getValueByKey(key: string): any;
}
