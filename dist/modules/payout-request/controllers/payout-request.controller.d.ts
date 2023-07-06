import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PayoutRequestCreatePayload, PayoutRequestPerformerUpdatePayload, PayoutRequestSearchPayload } from '../payloads/payout-request.payload';
import { PayoutRequestService } from '../services/payout-request.service';
export declare class PayoutRequestController {
    private readonly payoutRequestService;
    constructor(payoutRequestService: PayoutRequestService);
    create(payload: PayoutRequestCreatePayload, user: UserDto): Promise<DataResponse<any>>;
    calculate(payload: PayoutRequestSearchPayload, user: UserDto): Promise<DataResponse<any>>;
    stats(payload: PayoutRequestSearchPayload, user: UserDto): Promise<DataResponse<any>>;
    update(id: string, payload: PayoutRequestPerformerUpdatePayload, performer: UserDto): Promise<DataResponse<any>>;
    details(id: string, user: UserDto): Promise<DataResponse<any>>;
}
