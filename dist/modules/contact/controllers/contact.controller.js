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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../services");
const contact_payload_1 = require("../payloads/contact.payload");
let ContactController = class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
    }
    async contact(payload) {
        await this.contactService.contact(payload);
        return kernel_1.DataResponse.ok({ success: true });
    }
};
__decorate([
    common_1.Post('/'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_payload_1.ContactPayload]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "contact", null);
ContactController = __decorate([
    common_1.Injectable(),
    common_1.Controller('contact'),
    __metadata("design:paramtypes", [services_1.ContactService])
], ContactController);
exports.ContactController = ContactController;
//# sourceMappingURL=contact.controller.js.map