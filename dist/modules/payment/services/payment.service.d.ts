import { PerformerService } from 'src/modules/performer/services';
import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserService } from 'src/modules/user/services';
import { OrderModel, PaymentTransactionModel } from '../models';
import { SubscriptionService } from '../../subscription/services/subscription.service';
import { CCBillService } from './ccbill.service';
import { OrderService } from './order.service';
import { VerotelService } from './verotel.service';
export declare class PaymentService {
    private readonly performerService;
    private readonly paymentTransactionModel;
    private readonly ccbillService;
    private readonly queueEventService;
    private readonly subscriptionService;
    private readonly orderService;
    private readonly userService;
    private readonly verotelService;
    constructor(performerService: PerformerService, paymentTransactionModel: Model<PaymentTransactionModel>, ccbillService: CCBillService, queueEventService: QueueEventService, subscriptionService: SubscriptionService, orderService: OrderService, userService: UserService, verotelService: VerotelService);
    findById(id: string | ObjectId): Promise<PaymentTransactionModel>;
    create(transaction: any): Promise<PaymentTransactionModel>;
    private getPerformerSinglePaymentGatewaySetting;
    private getPerformerSubscroptionPaymentGatewaySetting;
    subscribePerformer(order: OrderModel, paymentGateway?: string): Promise<{
        paymentUrl: string;
    }>;
    purchasePerformerProducts(order: OrderModel, paymentGateway?: string): Promise<{
        paymentUrl: string;
    }>;
    purchasePerformerVOD(order: OrderModel, paymentGateway?: string): Promise<{
        paymentUrl: string;
    }>;
    ccbillSinglePaymentSuccessWebhook(payload: Record<string, any>): Promise<{
        ok: boolean;
    }>;
    ccbillRenewalSuccessWebhook(payload: any): Promise<{
        ok: boolean;
    }>;
    verotelSuccessWebhook(payload: any): Promise<boolean>;
}
