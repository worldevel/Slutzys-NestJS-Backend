import { Model } from 'mongoose';
import { PageableData } from 'src/kernel/common';
import { PerformerBlockService } from 'src/modules/block/services';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerModel } from '../models';
import { IPerformerResponse, PerformerDto } from '../dtos';
import { PerformerSearchPayload } from '../payloads';
export declare class PerformerSearchService {
    private readonly performerBlockService;
    private readonly performerModel;
    constructor(performerBlockService: PerformerBlockService, performerModel: Model<PerformerModel>);
    adminSearch(req: PerformerSearchPayload): Promise<PageableData<PerformerDto>>;
    search(req: PerformerSearchPayload, user: UserDto, countryCode: string): Promise<PageableData<IPerformerResponse>>;
    searchByKeyword(req: PerformerSearchPayload): Promise<any>;
}
