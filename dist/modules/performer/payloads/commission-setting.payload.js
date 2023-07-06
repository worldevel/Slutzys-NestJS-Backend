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
exports.CommissionSettingPayload = void 0;
const class_validator_1 = require("class-validator");
class CommissionSettingPayload {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CommissionSettingPayload.prototype, "performerId", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0.01),
    class_validator_1.Max(0.99),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CommissionSettingPayload.prototype, "monthlySubscriptionCommission", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0.01),
    class_validator_1.Max(0.99),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CommissionSettingPayload.prototype, "yearlySubscriptionCommission", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0.01),
    class_validator_1.Max(0.99),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CommissionSettingPayload.prototype, "videoSaleCommission", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0.01),
    class_validator_1.Max(0.99),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CommissionSettingPayload.prototype, "productSaleCommission", void 0);
exports.CommissionSettingPayload = CommissionSettingPayload;
//# sourceMappingURL=commission-setting.payload.js.map