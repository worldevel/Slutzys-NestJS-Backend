import { DataResponse, PageableData } from 'src/kernel';
import { OrderService } from '../services';
import { OrderDto } from '../dtos';
import { OrderSearchPayload, OrderUpdatePayload } from '../payloads';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    ordersDetails(req: OrderSearchPayload, user: any): Promise<DataResponse<PageableData<any>>>;
    orders(req: OrderSearchPayload, user: any): Promise<DataResponse<PageableData<OrderDto>>>;
    userDetailsOrders(req: OrderSearchPayload, user: any): Promise<DataResponse<PageableData<OrderDto>>>;
    userOrders(req: OrderSearchPayload, user: any): Promise<DataResponse<PageableData<OrderDto>>>;
    update(id: string, payload: OrderUpdatePayload, user: any): Promise<DataResponse<any>>;
    details(id: string): Promise<DataResponse<any>>;
    details2(id: string): Promise<DataResponse<any>>;
}
