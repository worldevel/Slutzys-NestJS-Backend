import { DataResponse } from 'src/kernel';
import { UserAdditionalInfoService } from '../services/user-additional-info.service';
export declare class UserAdditionalInfoController {
    private readonly userAdditionalInfoService;
    constructor(userAdditionalInfoService: UserAdditionalInfoService);
    listHeight(): DataResponse<any>;
}
