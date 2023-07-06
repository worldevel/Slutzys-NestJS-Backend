import { DataResponse } from 'src/kernel';
import { SettingService } from '../services';
export declare class SettingController {
    private readonly settingService;
    constructor(settingService: SettingService);
    getPublicSettings(): Promise<DataResponse<Map<string, any>>>;
}
