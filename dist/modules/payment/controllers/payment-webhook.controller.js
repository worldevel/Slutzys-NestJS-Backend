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
exports.PaymentWebhookController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const payment_service_1 = require("../services/payment.service");
let PaymentWebhookController = class PaymentWebhookController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async ccbillCallhook(payload, req) {
        if (!['NewSaleSuccess', 'RenewalSuccess'].includes(req.eventType)) {
            return kernel_1.DataResponse.ok(false);
        }
        let info;
        const data = Object.assign(Object.assign({}, payload), req);
        switch (req.eventType) {
            case 'RenewalSuccess':
                info = await this.paymentService.ccbillRenewalSuccessWebhook(data);
                break;
            default:
                info = await this.paymentService.ccbillSinglePaymentSuccessWebhook(data);
                break;
        }
        return kernel_1.DataResponse.ok(info);
    }
    async verotelCallhook(query, res) {
        await this.paymentService.verotelSuccessWebhook(query);
        res.setHeader('content-type', 'text/plain');
        res.send('OK');
    }
    async verotelCallhookGet(query, res) {
        await this.paymentService.verotelSuccessWebhook(query);
        res.setHeader('content-type', 'text/plain');
        res.send('OK');
    }
};
__decorate([
    common_1.Post('/ccbill/callhook'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentWebhookController.prototype, "ccbillCallhook", null);
__decorate([
    common_1.Post('/verotel/callhook'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentWebhookController.prototype, "verotelCallhook", null);
__decorate([
    common_1.Get('/verotel/callhook'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentWebhookController.prototype, "verotelCallhookGet", null);
PaymentWebhookController = __decorate([
    common_1.Injectable(),
    common_1.Controller('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentWebhookController);
exports.PaymentWebhookController = PaymentWebhookController;
//# sourceMappingURL=payment-webhook.controller.js.map