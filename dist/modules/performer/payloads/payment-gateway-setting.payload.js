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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewaySettingPayload = exports.CCBillPaymentGateway = void 0;
const class_validator_1 = require("class-validator");
class CCBillPaymentGateway {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CCBillPaymentGateway.prototype, "subscriptionSubAccountNumber", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CCBillPaymentGateway.prototype, "singlePurchaseSubAccountNumber", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CCBillPaymentGateway.prototype, "flexformId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CCBillPaymentGateway.prototype, "salt", void 0);
exports.CCBillPaymentGateway = CCBillPaymentGateway;
class PaymentGatewaySettingPayload {
    constructor() {
        this.key = 'ccbill';
        this.status = 'active';
    }
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PaymentGatewaySettingPayload.prototype, "performerId", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], PaymentGatewaySettingPayload.prototype, "key", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], PaymentGatewaySettingPayload.prototype, "status", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.ValidateNested(),
    __metadata("design:type", CCBillPaymentGateway)
], PaymentGatewaySettingPayload.prototype, "value", void 0);
exports.PaymentGatewaySettingPayload = PaymentGatewaySettingPayload;
//# sourceMappingURL=payment-gateway-setting.payload.js.map