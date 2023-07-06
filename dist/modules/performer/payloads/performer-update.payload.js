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
exports.SelfUpdatePayload = exports.PerformerUpdatePayload = void 0;
const class_validator_1 = require("class-validator");
const username_validator_1 = require("../../user/validators/username.validator");
const constants_1 = require("../../user/constants");
const swagger_1 = require("@nestjs/swagger");
const constants_2 = require("../constants");
class PerformerUpdatePayload {
    constructor() {
        this.status = constants_2.PERFORMER_STATUSES.ACTIVE;
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "firstName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "lastName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.Validate(username_validator_1.Username),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "username", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.MinLength(6),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsIn([constants_2.PERFORMER_STATUSES.ACTIVE, constants_2.PERFORMER_STATUSES.INACTIVE]),
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], PerformerUpdatePayload.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsEmail(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "phone", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "phoneCode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "avatarId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "coverId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "idVerificationId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "documentVerificationId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsIn(constants_1.GENDERS),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "gender", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "country", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "city", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "state", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "zipcode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "address", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsArray(),
    class_validator_1.IsString({ each: true }),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], PerformerUpdatePayload.prototype, "languages", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsArray(),
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], PerformerUpdatePayload.prototype, "categoryIds", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "height", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "weight", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "bio", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "eyes", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PerformerUpdatePayload.prototype, "sexualPreference", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(1),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], PerformerUpdatePayload.prototype, "monthlyPrice", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(1),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], PerformerUpdatePayload.prototype, "yearlyPrice", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], PerformerUpdatePayload.prototype, "bankingInfomation", void 0);
exports.PerformerUpdatePayload = PerformerUpdatePayload;
class SelfUpdatePayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "firstName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "lastName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.MinLength(6),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "phone", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "phoneCode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn(constants_1.GENDERS),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "gender", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "country", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "city", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "state", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "zipcode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "address", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsArray(),
    class_validator_1.IsString({ each: true }),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], SelfUpdatePayload.prototype, "languages", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsArray(),
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], SelfUpdatePayload.prototype, "categoryIds", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "height", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "weight", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "bio", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "eyes", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "sexualPreference", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(1),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], SelfUpdatePayload.prototype, "monthlyPrice", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(1),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], SelfUpdatePayload.prototype, "yearlyPrice", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], SelfUpdatePayload.prototype, "bankingInfomation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], SelfUpdatePayload.prototype, "activateWelcomeVideo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "idVerificationId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SelfUpdatePayload.prototype, "documentVerificationId", void 0);
exports.SelfUpdatePayload = SelfUpdatePayload;
//# sourceMappingURL=performer-update.payload.js.map