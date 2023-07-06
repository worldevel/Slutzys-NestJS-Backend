import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { EarningModel } from '../models/earning.model';
import { EarningSearchRequestPayload, UpdateEarningStatusPayload } from '../payloads';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
import { EarningDto, IEarningStatResponse } from '../dtos/earning.dto';
import { OrderService, PaymentService } from '../../payment/services';
export declare class EarningService {
    private readonly earningModel;
    private readonly userService;
    private readonly performerService;
    private readonly paymentService;
    private readonly orderService;
    constructor(earningModel: Model<EarningModel>, userService: UserService, performerService: PerformerService, paymentService: PaymentService, orderService: OrderService);
    search(req: EarningSearchRequestPayload, isAdmin?: boolean): Promise<PageableData<EarningDto>>;
    details(id: string): Promise<EarningDto>;
    stats(req: EarningSearchRequestPayload): Promise<IEarningStatResponse>;
    updatePaidStatus(payload: UpdateEarningStatusPayload): Promise<any>;
}
