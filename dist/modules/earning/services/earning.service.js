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
exports.EarningService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const earning_provider_1 = require("../providers/earning.provider");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const earning_dto_1 = require("../dtos/earning.dto");
const dtos_2 = require("../../performer/dtos");
const services_3 = require("../../payment/services");
let EarningService = class EarningService {
    constructor(earningModel, userService, performerService, paymentService, orderService) {
        this.earningModel = earningModel;
        this.userService = userService;
        this.performerService = performerService;
        this.paymentService = paymentService;
        this.orderService = orderService;
    }
    async search(req, isAdmin) {
        const query = {};
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.transactionId) {
            query.transactionId = req.transactionId;
        }
        if (req.sourceType) {
            query.sourceType = req.sourceType;
        }
        if (req.isPaid) {
            query.isPaid = req.isPaid;
        }
        const sort = {
            createdAt: -1
        };
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: new Date(req.fromDate),
                $lte: new Date(req.toDate)
            };
        }
        const [data, total] = await Promise.all([
            this.earningModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.earningModel.countDocuments(query)
        ]);
        const earnings = data.map((d) => new earning_dto_1.EarningDto(d));
        const PIds = data.map((d) => d.performerId);
        const UIds = data.map((d) => d.userId);
        const [performers, users] = await Promise.all([
            this.performerService.findByIds(PIds) || [],
            this.userService.findByIds(UIds) || []
        ]);
        earnings.forEach((earning) => {
            const performer = performers.find((p) => p._id.toString() === earning.performerId.toString());
            earning.performerInfo = performer
                ? new dtos_2.PerformerDto(performer).toResponse(true, isAdmin)
                : null;
            const user = users.find((p) => p._id.toString() === earning.userId.toString());
            earning.userInfo = user
                ? new dtos_1.UserDto(user).toResponse(true, isAdmin)
                : null;
        });
        return {
            data: earnings,
            total
        };
    }
    async details(id) {
        const earning = await this.earningModel.findById(string_helper_1.toObjectId(id));
        const transaction = await this.paymentService.findById(earning.transactionId);
        if (!earning || !transaction) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [user, performer] = await Promise.all([
            this.userService.findById(earning.userId),
            this.performerService.findById(earning.performerId)
        ]);
        const data = new earning_dto_1.EarningDto(earning);
        data.userInfo = user ? new dtos_1.UserDto(user).toResponse(true, true) : null;
        data.performerInfo = performer
            ? new dtos_2.PerformerDto(performer).toResponse(true, true)
            : null;
        if (earning === null || earning === void 0 ? void 0 : earning.orderId) {
            const order = await this.orderService.getOrderDetails(earning.orderId);
            if (!order) {
                throw new kernel_1.EntityNotFoundException();
            }
            data.order = order;
        }
        data.transactionInfo = transaction;
        return data;
    }
    async stats(req) {
        const query = {};
        if (req.performerId) {
            query.performerId = string_helper_1.toObjectId(req.performerId);
        }
        if (req.transactionId) {
            query.transactionId = req.transactionId;
        }
        if (req.sourceType) {
            query.sourceType = req.sourceType;
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: new Date(req.fromDate),
                $lte: new Date(req.toDate)
            };
        }
        const [totalGrossPrice, totalNetPrice] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $match: query
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$grossPrice'
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: query
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
        const totalGross = (totalGrossPrice && totalGrossPrice.length && totalGrossPrice[0].total) || 0;
        const totalNet = (totalNetPrice && totalNetPrice.length && totalNetPrice[0].total) || 0;
        const totalCommission = totalGross && totalNet ? (totalGross - totalNet) : 0;
        return {
            totalGrossPrice: totalGross,
            totalNetPrice: totalNet,
            totalCommission
        };
    }
    async updatePaidStatus(payload) {
        const query = {};
        if (payload.fromDate && payload.toDate) {
            query.createdAt = {
                $gte: new Date(payload.fromDate),
                $lte: new Date(payload.toDate)
            };
        }
        if (payload.performerId) {
            query.performerId = payload.performerId;
        }
        return this.earningModel.updateMany(query, {
            $set: { isPaid: true, paidAt: new Date() }
        });
    }
};
EarningService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.UserService,
        services_2.PerformerService,
        services_3.PaymentService,
        services_3.OrderService])
], EarningService);
exports.EarningService = EarningService;
//# sourceMappingURL=earning.service.js.map