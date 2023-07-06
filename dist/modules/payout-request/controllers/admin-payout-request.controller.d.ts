import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PayoutRequestService } from '../services/payout-request.service';
import { PayoutRequestSearchPayload, PayoutRequestUpdatePayload } from '../payloads/payout-request.payload';
export declare class AdminPayoutRequestController {
    private readonly payoutRequestService;
    constructor(payoutRequestService: PayoutRequestService);
    updateStatus(id: string, payload: PayoutRequestUpdatePayload): Promise<DataResponse<any>>;
    calculate(payload: PayoutRequestSearchPayload): Promise<DataResponse<any>>;
    stats(payload: PayoutRequestSearchPayload, user: UserDto): Promise<DataResponse<any>>;
    adminDetails(id: string): Promise<DataResponse<any>>;
    delete(id: string): Promise<DataResponse<any>>;
}
