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
exports.PostCreatePayload = void 0;
const class_validator_1 = require("class-validator");
const mongodb_1 = require("mongodb");
const swagger_1 = require("@nestjs/swagger");
class PostCreatePayload {
    constructor() {
        this.type = 'post';
        this.categoryIds = [];
        this.status = 'draft';
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PostCreatePayload.prototype, "title", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", mongodb_1.ObjectId)
], PostCreatePayload.prototype, "authorId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], PostCreatePayload.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PostCreatePayload.prototype, "slug", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], PostCreatePayload.prototype, "ordering", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PostCreatePayload.prototype, "content", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PostCreatePayload.prototype, "shortDescription", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsArray(),
    class_validator_1.IsString({ each: true }),
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], PostCreatePayload.prototype, "categoryIds", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.IsIn(['draft', 'published']),
    __metadata("design:type", Object)
], PostCreatePayload.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PostCreatePayload.prototype, "image", void 0);
exports.PostCreatePayload = PostCreatePayload;
//# sourceMappingURL=post-create.payload.js.map