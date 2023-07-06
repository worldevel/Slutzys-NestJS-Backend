import { DataResponse } from 'src/kernel';
import { SiteBlockCountryService } from 'src/modules/block/services';
import { CountryService } from 'src/modules/utils/services';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly blockCountryService;
    private readonly countryService;
    constructor(appService: AppService, blockCountryService: SiteBlockCountryService, countryService: CountryService);
    blockCountry(req: any): Promise<DataResponse<any>>;
    getHello(): string;
}
