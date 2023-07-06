import { DataResponse } from 'src/kernel';
import { SiteBlockCountryService } from '../services';
import { BlockCountryCreatePayload } from '../payloads/site-block-country.payload';
export declare class SiteBlockCountryController {
    private readonly blockCountryService;
    constructor(blockCountryService: SiteBlockCountryService);
    search(): Promise<DataResponse<any>>;
    createUser(payload: BlockCountryCreatePayload): Promise<DataResponse<any>>;
    delete(countryCode: string): Promise<DataResponse<boolean>>;
}
