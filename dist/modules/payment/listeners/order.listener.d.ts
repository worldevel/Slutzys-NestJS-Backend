import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import { OrderDto } from '../dtos';
import { OrderDetailsModel, OrderModel } from '../models';
export declare class OrderListener {
    private readonly performerService;
    private readonly userService;
    private readonly mailService;
    private readonly orderModel;
    private readonly orderDetailsModel;
    private readonly queueEventService;
    constructor(performerService: PerformerService, userService: UserService, mailService: MailerService, orderModel: Model<OrderModel>, orderDetailsModel: Model<OrderDetailsModel>, queueEventService: QueueEventService);
    private handleEmailProducts;
    private handleEmailSubscription;
    handleListen(event: QueueEvent): Promise<OrderDto>;
}
