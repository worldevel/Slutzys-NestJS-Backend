import { DataResponse } from 'src/kernel';
import { CityService } from '../services/city.service';
export declare class CityController {
    private readonly cityService;
    constructor(cityService: CityService);
    list(countryCode: string, state: string): DataResponse<any>;
}
