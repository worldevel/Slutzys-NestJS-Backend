import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerBlockUserDto } from '../dtos';
import { PerformerBlockCountriesPayload, PerformerBlockUserPayload, GetBlockListUserPayload } from '../payloads';
import { PerformerBlockService } from '../services';
export declare class PerformerBlockController {
    private readonly performerBlockService;
    constructor(performerBlockService: PerformerBlockService);
    performerBlockCountries(payload: PerformerBlockCountriesPayload, user: UserDto): Promise<DataResponse<any>>;
    blockUser(performer: UserDto, payload: PerformerBlockUserPayload): Promise<DataResponse<any>>;
    unblockUser(userId: string, performer: UserDto): Promise<DataResponse<any>>;
    search(performer: UserDto, payload: GetBlockListUserPayload): Promise<DataResponse<PageableData<PerformerBlockUserDto>>>;
}
