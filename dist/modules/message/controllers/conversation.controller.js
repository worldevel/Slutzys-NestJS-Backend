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
exports.ConversationController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const auth_1 = require("../../auth");
const services_1 = require("../../utils/services");
const dtos_1 = require("../dtos");
const conversation_service_1 = require("../services/conversation.service");
const payloads_1 = require("../payloads");
let ConversationController = class ConversationController {
    constructor(countryService, conversationService) {
        this.countryService = countryService;
        this.conversationService = conversationService;
    }
    async getListOfCurrentUser(query, req) {
        let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ipClient.substr(0, 7) === '::ffff:') {
            ipClient = ipClient.substr(7);
        }
        const whiteListIps = ['127.0.0.1', '0.0.0.1'];
        let countryCode = null;
        if (whiteListIps.indexOf(ipClient) === -1) {
            const userCountry = await this.countryService.findCountryByIP(ipClient);
            if ((userCountry === null || userCountry === void 0 ? void 0 : userCountry.status) === 'success' && (userCountry === null || userCountry === void 0 ? void 0 : userCountry.countryCode)) {
                countryCode = userCountry.countryCode;
            }
        }
        const items = await this.conversationService.getList(query, {
            source: req.authUser.source,
            sourceId: req.authUser.sourceId
        }, countryCode);
        return kernel_1.DataResponse.ok(items);
    }
    async getDetails(conversationId) {
        const data = await this.conversationService.findById(conversationId);
        return kernel_1.DataResponse.ok(new dtos_1.ConversationDto(data));
    }
    async create(payload, user) {
        if (payload.sourceId === user._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        const sender = {
            source: user.isPerformer ? 'performer' : 'user',
            sourceId: user._id
        };
        const receiver = {
            source: payload.source,
            sourceId: string_helper_1.toObjectId(payload.sourceId)
        };
        const conversation = await this.conversationService.createPrivateConversation(sender, receiver);
        return kernel_1.DataResponse.ok(conversation);
    }
};
__decorate([
    common_1.Get('/'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    __param(0, common_1.Query()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ConversationSearchPayload, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getListOfCurrentUser", null);
__decorate([
    common_1.Get('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getDetails", null);
__decorate([
    common_1.Post('/'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    __param(0, common_1.Body()),
    __param(1, auth_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ConversationCreatePayload, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "create", null);
ConversationController = __decorate([
    common_1.Injectable(),
    common_1.Controller('conversations'),
    __metadata("design:paramtypes", [services_1.CountryService,
        conversation_service_1.ConversationService])
], ConversationController);
exports.ConversationController = ConversationController;
//# sourceMappingURL=conversation.controller.js.map