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
exports.UpdatePerformerStatusListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../mailer/services");
const PERFORMER_STATUS_TOPIC = 'PERFORMER_STATUS_TOPIC';
let UpdatePerformerStatusListener = class UpdatePerformerStatusListener {
    constructor(queueEventService, mailService) {
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.queueEventService.subscribe(constants_1.PERFORMER_UPDATE_STATUS_CHANNEL, PERFORMER_STATUS_TOPIC, this.handleUpdateStatus.bind(this));
    }
    async handleUpdateStatus(event) {
        if (![constants_2.EVENT.UPDATED].includes(event.eventName)) {
            return false;
        }
        const { oldStatus, status, email, name } = event.data;
        if (oldStatus === constants_1.PERFORMER_STATUSES.ACTIVE) {
            return false;
        }
        if (email && status === constants_1.PERFORMER_STATUSES.ACTIVE) {
            await this.mailService.send({
                subject: 'Your account has been approved',
                to: email,
                data: { name },
                template: 'approved-performer-account'
            });
        }
        return true;
    }
};
UpdatePerformerStatusListener = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.MailerService))),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.MailerService])
], UpdatePerformerStatusListener);
exports.UpdatePerformerStatusListener = UpdatePerformerStatusListener;
//# sourceMappingURL=performer-status.listener.js.map