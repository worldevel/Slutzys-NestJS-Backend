import { Model } from 'mongoose';
import { SiteBlockCountryModel } from '../models';
import { BlockCountryCreatePayload } from '../payloads';
export declare class SiteBlockCountryService {
    private readonly blockCountryModel;
    constructor(blockCountryModel: Model<SiteBlockCountryModel>);
    create(payload: BlockCountryCreatePayload): Promise<any>;
    search(): Promise<any>;
    delete(code: any): Promise<any>;
    checkCountryBlock(countryCode: any): Promise<{
        blocked: boolean;
    }>;
}
