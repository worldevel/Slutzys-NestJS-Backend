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
exports.ReactionCreatePayload = void 0;
const class_validator_1 = require("class-validator");
const constants_1 = require("../constants");
class ReactionCreatePayload {
    constructor() {
        this.objectType = constants_1.REACTION_TYPE.VIDEO;
    }
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.IsIn([
        constants_1.REACTION_TYPE.VIDEO,
        constants_1.REACTION_TYPE.PERFORMER,
        constants_1.REACTION_TYPE.COMMENT,
        constants_1.REACTION_TYPE.GALLERY,
        constants_1.REACTION_TYPE.PRODUCT
    ]),
    __metadata("design:type", Object)
], ReactionCreatePayload.prototype, "objectType", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.IsIn([
        constants_1.REACTION.LIKE,
        constants_1.REACTION.FAVOURITE,
        constants_1.REACTION.WATCH_LATER
    ]),
    __metadata("design:type", String)
], ReactionCreatePayload.prototype, "action", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], ReactionCreatePayload.prototype, "objectId", void 0);
exports.ReactionCreatePayload = ReactionCreatePayload;
//# sourceMappingURL=reaction.payload.js.map