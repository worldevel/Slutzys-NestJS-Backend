import { QueueEventService, QueueEvent } from 'src/kernel';
import { FileService } from 'src/modules/file/services';
import { MailerService } from 'src/modules/mailer/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { ProductService } from '../services';
export declare class StockProductListener {
    private readonly queueEventService;
    private readonly productService;
    private readonly mailService;
    private readonly fileService;
    private readonly userService;
    private readonly performerService;
    constructor(queueEventService: QueueEventService, productService: ProductService, mailService: MailerService, fileService: FileService, userService: UserService, performerService: PerformerService);
    handleStockProducts(event: QueueEvent): Promise<void>;
    sendDigitalProductLink(orderDetail: any): Promise<void>;
}
