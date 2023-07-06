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
exports.VideoUpdatePayload = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class VideoUpdatePayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], VideoUpdatePayload.prototype, "title", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], VideoUpdatePayload.prototype, "description", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], VideoUpdatePayload.prototype, "tagline", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.IsIn(['active', 'inactive']),
    __metadata("design:type", String)
], VideoUpdatePayload.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], VideoUpdatePayload.prototype, "tags", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], VideoUpdatePayload.prototype, "isSchedule", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], VideoUpdatePayload.prototype, "scheduledAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], VideoUpdatePayload.prototype, "isSale", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], VideoUpdatePayload.prototype, "price", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], VideoUpdatePayload.prototype, "performerId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], VideoUpdatePayload.prototype, "participantIds", void 0);
exports.VideoUpdatePayload = VideoUpdatePayload;
//# sourceMappingURL=video-update.payload.js.map