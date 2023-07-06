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
exports.ProductCreatePayload = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const mongodb_1 = require("mongodb");
const constants_1 = require("../constants");
class ProductCreatePayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], ProductCreatePayload.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], ProductCreatePayload.prototype, "description", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.IsIn([constants_1.PRODUCT_STATUS.ACTIVE, constants_1.PRODUCT_STATUS.INACTIVE]),
    __metadata("design:type", String)
], ProductCreatePayload.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.IsIn([constants_1.PRODUCT_TYPE.DIGITAL, constants_1.PRODUCT_TYPE.PHYSICAL]),
    __metadata("design:type", String)
], ProductCreatePayload.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], ProductCreatePayload.prototype, "price", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], ProductCreatePayload.prototype, "stock", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", mongodb_1.ObjectId)
], ProductCreatePayload.prototype, "performerId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], ProductCreatePayload.prototype, "categoryIds", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], ProductCreatePayload.prototype, "imageIds", void 0);
exports.ProductCreatePayload = ProductCreatePayload;
//# sourceMappingURL=product-create.payload.js.map