import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { BannerCreatePayload, BannerUpdatePayload, BannerSearchRequest } from '../payloads';
import { BannerService, BannerSearchService } from '../services';
export declare class AdminBannerController {
    private readonly bannerService;
    private readonly bannerSearchService;
    constructor(bannerService: BannerService, bannerSearchService: BannerSearchService);
    upload(files: Record<string, any>, payload: BannerCreatePayload, creator: UserDto): Promise<any>;
    update(id: string, payload: BannerUpdatePayload, updater: UserDto): Promise<DataResponse<import("../dtos").BannerDto>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    search(req: BannerSearchRequest): Promise<DataResponse<import("../../../kernel").PageableData<import("../dtos").BannerDto>>>;
    details(id: string): Promise<DataResponse<import("../dtos").BannerDto>>;
}
