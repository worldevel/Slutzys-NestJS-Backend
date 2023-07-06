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
exports.PayoutRequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../performer/dtos");
const services_1 = require("../../performer/services");
const mailer_1 = require("../../mailer");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const moment = require("moment");
const earning_provider_1 = require("../../earning/providers/earning.provider");
const earning_model_1 = require("../../earning/models/earning.model");
const dtos_2 = require("../../user/dtos");
const constants_2 = require("../../../kernel/constants");
const constants_3 = require("../constants");
const exceptions_1 = require("../exceptions");
const payout_request_dto_1 = require("../dtos/payout-request.dto");
const payout_request_provider_1 = require("../providers/payout-request.provider");
let PayoutRequestService = class PayoutRequestService {
    constructor(earningModel, payoutRequestModel, queueEventService, performerService, mailService, settingService) {
        this.earningModel = earningModel;
        this.payoutRequestModel = payoutRequestModel;
        this.queueEventService = queueEventService;
        this.performerService = performerService;
        this.mailService = mailService;
        this.settingService = settingService;
    }
    async search(req, user) {
        var _a;
        const query = {};
        if (req.sourceId) {
            query.sourceId = string_helper_1.toObjectId(req.sourceId);
        }
        if (req.source) {
            query.source = req.source;
        }
        if (req.status) {
            query.status = req.status;
        }
        let sort = {
            updatedAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gte: moment(req.fromDate).startOf('day').toDate(),
                $lte: moment(req.toDate).endOf('day').toDate()
            };
        }
        const [data, total] = await Promise.all([
            this.payoutRequestModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.payoutRequestModel.countDocuments(query)
        ]);
        const requests = data.map((d) => new payout_request_dto_1.PayoutRequestDto(d));
        if ((_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.includes('admin')) {
            const sourceIds = lodash_1.uniq(requests.map((r) => r.sourceId));
            const sources = await this.performerService.findByIds(sourceIds);
            requests.forEach((request) => {
                const sourceInfo = sources.find((s) => s && s._id.toString() === request.sourceId.toString());
                request.sourceInfo = sourceInfo && new dtos_1.PerformerDto(sourceInfo).toResponse();
            });
        }
        return {
            total,
            data: requests
        };
    }
    async findById(id) {
        const request = await this.payoutRequestModel.findById(id);
        return request;
    }
    async performerCreate(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { fromDate: moment(payload.fromDate).startOf('day').toDate(), toDate: moment(payload.toDate).endOf('day').toDate(), sourceId: user._id, updatedAt: new Date(), createdAt: new Date() });
        const query = {
            sourceId: user._id,
            fromDate: moment(payload.fromDate).startOf('day').toDate(),
            toDate: moment(payload.toDate).endOf('day').toDate(),
            status: constants_3.STATUSES.PENDING,
            createdAt: { $gte: moment().subtract(1, 'day').toDate() }
        };
        const request = await this.payoutRequestModel.findOne(query);
        if (request) {
            throw new exceptions_1.DuplicateRequestException();
        }
        const { unpaidPrice } = await this.calculateByDate(user, {
            fromDate: payload.fromDate,
            toDate: payload.toDate
        });
        data.requestedPrice = unpaidPrice;
        if (data.paymentAccountType === constants_3.PAYMENT_ACCOUNT_TYPE.BANKING) {
            data.paymentAccountInfo = await this.performerService.getBankingSettings(user._id);
            if (!data.paymentAccountInfo || !data.paymentAccountInfo.firstName || !data.paymentAccountInfo.lastName || !data.paymentAccountInfo.bankAccount) {
                throw new common_1.HttpException('Missing banking informations', 404);
            }
        }
        if (data.paymentAccountType === constants_3.PAYMENT_ACCOUNT_TYPE.PAYPAL) {
            const paymentAccountInfo = await this.performerService.getPaymentSetting(user._id, 'paypal');
            if (!paymentAccountInfo || !paymentAccountInfo.value || !paymentAccountInfo.value.email) {
                throw new common_1.HttpException('Missing paypal account information', 404);
            }
            data.paymentAccountInfo = (paymentAccountInfo === null || paymentAccountInfo === void 0 ? void 0 : paymentAccountInfo.value) || null;
        }
        const resp = await this.payoutRequestModel.create(data);
        const adminEmail = (await this.settingService.getKeyValue(constants_1.SETTING_KEYS.ADMIN_EMAIL)) || process.env.ADMIN_EMAIL;
        adminEmail && await this.mailService.send({
            subject: 'New payout request',
            to: adminEmail,
            data: {
                request: resp,
                requestName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || 'N/A'
            },
            template: 'admin-payout-request'
        });
        return new payout_request_dto_1.PayoutRequestDto(resp);
    }
    async calculateByDate(user, req) {
        var _a;
        const [unpaidPrice] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: moment(req.fromDate).startOf('day').toDate(),
                            $lte: moment(req.toDate).endOf('day').toDate()
                        },
                        isPaid: false,
                        performerId: string_helper_1.toObjectId(user._id)
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ])
        ]);
        return {
            unpaidPrice: (unpaidPrice[0] && ((_a = unpaidPrice[0]) === null || _a === void 0 ? void 0 : _a.total)) || 0
        };
    }
    async calculateStats(user, req) {
        var _a, _b, _c, _d;
        let performerId = user._id;
        if (user.roles && user.roles.includes('admin') && req.sourceId) {
            performerId = req.sourceId;
        }
        const [unpaidPrice, totalPrice] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $match: {
                        isPaid: false,
                        performerId: string_helper_1.toObjectId(performerId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: {
                        performerId: string_helper_1.toObjectId(performerId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ])
        ]);
        return {
            unpaidPrice: ((_a = unpaidPrice[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            paidPrice: (((_b = totalPrice[0]) === null || _b === void 0 ? void 0 : _b.total) - ((_c = unpaidPrice[0]) === null || _c === void 0 ? void 0 : _c.total)) || 0,
            totalPrice: ((_d = totalPrice[0]) === null || _d === void 0 ? void 0 : _d.total) || 0
        };
    }
    async performerUpdate(id, payload, user) {
        const payout = await this.payoutRequestModel.findOne({ _id: id });
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user._id.toString() !== payout.sourceId.toString() || payout.status !== constants_3.STATUSES.PENDING) {
            throw new common_1.ForbiddenException();
        }
        const data = Object.assign({}, payload);
        const { unpaidPrice } = await this.calculateByDate(user, {
            fromDate: payload.fromDate,
            toDate: payload.toDate
        });
        data.fromDate = moment(payload.fromDate).startOf('day').toDate();
        data.toDate = moment(payload.toDate).endOf('day').toDate();
        data.requestedPrice = unpaidPrice;
        if (data.paymentAccountType === constants_3.PAYMENT_ACCOUNT_TYPE.BANKING) {
            data.paymentAccountInfo = await this.performerService.getBankingSettings(payout.sourceId);
            if (!data.paymentAccountInfo || !data.paymentAccountInfo.firstName || !data.paymentAccountInfo.lastName || !data.paymentAccountInfo.bankAccount) {
                throw new common_1.HttpException('Missing banking informations', 404);
            }
        }
        if (data.paymentAccountType === constants_3.PAYMENT_ACCOUNT_TYPE.PAYPAL) {
            const paymentAccountInfo = await this.performerService.getPaymentSetting(payout.sourceId, 'paypal');
            if (!paymentAccountInfo || !paymentAccountInfo.value || !paymentAccountInfo.value.email) {
                throw new common_1.HttpException('Missing paypal account information', 404);
            }
            data.paymentAccountInfo = (paymentAccountInfo === null || paymentAccountInfo === void 0 ? void 0 : paymentAccountInfo.value) || null;
        }
        lodash_1.merge(payout, data);
        await payout.save();
        return new payout_request_dto_1.PayoutRequestDto(payout);
    }
    async details(id, user) {
        const payout = await this.payoutRequestModel.findById(id);
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user._id.toString() !== payout.sourceId.toString()) {
            throw new common_1.ForbiddenException();
        }
        const data = new payout_request_dto_1.PayoutRequestDto(payout);
        data.sourceInfo = new dtos_1.PerformerDto(user).toSearchResponse() || null;
        return data;
    }
    async adminDetails(id) {
        const payout = await this.payoutRequestModel.findById(id);
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = new payout_request_dto_1.PayoutRequestDto(payout);
        const { sourceId, source } = data;
        if (source === constants_3.SOURCE_TYPE.PERFORMER) {
            const sourceInfo = await this.performerService.findById(sourceId);
            if (sourceInfo) {
                data.sourceInfo = new dtos_1.PerformerDto(sourceInfo).toResponse();
            }
        }
        return data;
    }
    async adminDelete(id) {
        const payout = await this.payoutRequestModel.findById(id);
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        if ([constants_3.STATUSES.DONE, constants_3.STATUSES.REJECTED].includes(payout.status)) {
            throw new common_1.ForbiddenException();
        }
        await payout.remove();
        return { deleted: true };
    }
    async adminUpdateStatus(id, payload) {
        const request = await this.payoutRequestModel.findById(id);
        if (!request) {
            throw new kernel_1.EntityNotFoundException();
        }
        const oldStatus = request.status;
        lodash_1.merge(request, payload);
        request.updatedAt = new Date();
        await request.save();
        const event = {
            channel: constants_3.PAYOUT_REQUEST_CHANEL,
            eventName: constants_2.EVENT.UPDATED,
            data: {
                request,
                oldStatus
            }
        };
        await this.queueEventService.publish(event);
        return request;
    }
};
PayoutRequestService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __param(1, common_1.Inject(payout_request_provider_1.PAYOUT_REQUEST_MODEL_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => kernel_1.QueueEventService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => mailer_1.MailerService))),
    __param(5, common_1.Inject(common_1.forwardRef(() => settings_1.SettingService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.PerformerService,
        mailer_1.MailerService,
        settings_1.SettingService])
], PayoutRequestService);
exports.PayoutRequestService = PayoutRequestService;
//# sourceMappingURL=payout-request.service.js.map