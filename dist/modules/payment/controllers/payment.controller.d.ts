import { DataResponse } from 'src/kernel';
import { SubscribePerformerPayload, PurchaseProductsPayload, PurchaseVideoPayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services';
export declare class PaymentController {
    private readonly orderService;
    private readonly paymentService;
    constructor(orderService: OrderService, paymentService: PaymentService);
    create(user: UserDto, payload: SubscribePerformerPayload): Promise<DataResponse<any>>;
    purchaseVideo(user: UserDto, payload: PurchaseVideoPayload): Promise<DataResponse<any>>;
    purchaseProducts(user: UserDto, payload: PurchaseProductsPayload): Promise<DataResponse<any>>;
}
