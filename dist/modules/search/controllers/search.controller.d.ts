import { DataResponse } from 'src/kernel';
import { CountryService } from 'src/modules/utils/services';
import { SearchPayload } from '../payloads';
import { SearchService } from '../services/search.service';
export declare class SearchController {
    private readonly searchService;
    private readonly countryService;
    constructor(searchService: SearchService, countryService: CountryService);
    list(query: SearchPayload, req: any): Promise<DataResponse<any>>;
}
