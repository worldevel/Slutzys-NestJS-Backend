import { DataResponse, PageableData } from 'src/kernel';
import { EarningService } from '../services/earning.service';
import { EarningSearchRequestPayload, UpdateEarningStatusPayload } from '../payloads';
import { EarningDto, IEarningStatResponse } from '../dtos/earning.dto';
import { UserDto } from '../../user/dtos';
export declare class EarningController {
    private readonly earningService;
    constructor(earningService: EarningService);
    adminSearch(req: EarningSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<EarningDto>>>;
    search(req: EarningSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<EarningDto>>>;
    adminStats(req: EarningSearchRequestPayload): Promise<DataResponse<IEarningStatResponse>>;
    performerStats(req: EarningSearchRequestPayload, user: UserDto): Promise<DataResponse<IEarningStatResponse>>;
    updateStats(payload: UpdateEarningStatusPayload): Promise<DataResponse<IEarningStatResponse>>;
    details(id: string): Promise<DataResponse<EarningDto>>;
}
