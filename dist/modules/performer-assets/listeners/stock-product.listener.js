"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockProductListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../payment/constants");
const services_1 = require("../../file/services");
const constants_2 = require("../../../kernel/constants");
const services_2 = require("../../mailer/services");
const services_3 = require("../../performer/services");
const services_4 = require("../../user/services");
const services_5 = require("../services");
const constants_3 = require("../constants");
const UPDATE_STOCK_CHANNEL = 'UPDATE_STOCK_CHANNEL';
let StockProductListener = class StockProductListener {
    constructor(queueEventService, productService, mailService, fileService, userService, performerService) {
        this.queueEventService = queueEventService;
        this.productService = productService;
        this.mailService = mailService;
        this.fileService = fileService;
        this.userService = userService;
        this.performerService = performerService;
        this.queueEventService.subscribe(constants_1.ORDER_PAID_SUCCESS_CHANNEL, UPDATE_STOCK_CHANNEL, this.handleStockProducts.bind(this));
    }
    async handleStockProducts(event) {
        if (![constants_2.EVENT.CREATED].includes(event.eventName)) {
            return;
        }
        const { orderDetails } = event.data;
        const performerProductOrders = orderDetails.filter((o) => [constants_3.PRODUCT_TYPE.DIGITAL, constants_3.PRODUCT_TYPE.PHYSICAL].includes(o.productType));
        if (!performerProductOrders.length) {
            return;
        }
        for (const orderDetail of performerProductOrders) {
            switch (orderDetail.productType) {
                case constants_3.PRODUCT_TYPE.PHYSICAL:
                    await this.productService.updateStock(orderDetail.productId, -1 * (orderDetail.quantity || 1));
                    break;
                case constants_3.PRODUCT_TYPE.DIGITAL:
                    await this.sendDigitalProductLink(orderDetail);
                    break;
                default: break;
            }
        }
    }
    async sendDigitalProductLink(orderDetail) {
        const product = await this.productService.getDetails(orderDetail.productId);
        if (!product || product.type !== 'digital' || !product.digitalFileId)
            return;
        const digitalLink = await this.fileService.generateDownloadLink(product.digitalFileId);
        const performer = await this.performerService.findById(orderDetail.sellerId);
        const user = await this.userService.findById(orderDetail.buyerId);
        user.email && await this.mailService.send({
            subject: `Order #${orderDetail.orderNumber} - Digital file to download`,
            to: user.email,
            data: {
                performer,
                user,
                orderDetail,
                digitalLink,
                totalPrice: (orderDetail.totalPrice || 0).toFixed(2)
            },
            template: 'send-user-digital-product'
        });
    }
};
StockProductListener = __decorate([
    common_1.Injectable(),
    __param(5, common_1.Inject(common_1.forwardRef(() => services_3.PerformerService))),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_5.ProductService,
        services_2.MailerService,
        services_1.FileService,
        services_4.UserService,
        services_3.PerformerService])
], StockProductListener);
exports.StockProductListener = StockProductListener;
//# sourceMappingURL=stock-product.listener.js.map