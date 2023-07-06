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
exports.UpdateEarningStatusPayload = exports.EarningSearchRequestPayload = void 0;
const common_1 = require("../../../kernel/common");
const class_validator_1 = require("class-validator");
class EarningSearchRequestPayload extends common_1.SearchRequest {
}
exports.EarningSearchRequestPayload = EarningSearchRequestPayload;
class UpdateEarningStatusPayload {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateEarningStatusPayload.prototype, "performerId", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Object)
], UpdateEarningStatusPayload.prototype, "fromDate", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Object)
], UpdateEarningStatusPayload.prototype, "toDate", void 0);
exports.UpdateEarningStatusPayload = UpdateEarningStatusPayload;
//# sourceMappingURL=earning-search.payload.js.map