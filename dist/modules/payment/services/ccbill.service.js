"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCBillService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const axios_1 = require("axios");
const constants_1 = require("../../subscription/constants");
const crypto = require('crypto');
let CCBillService = class CCBillService {
    subscription(options) {
        const { transactionId } = options;
        const { salt } = options;
        const { flexformId } = options;
        const { subAccountNumber } = options;
        const initialPrice = options.price.toFixed(2);
        const initialPeriod = (options.subscriptionType === constants_1.SUBSCRIPTION_TYPE.MONTHLY || options.subscriptionType === 'monthly_subscription') ? 30 : 365;
        const currencyCode = '840';
        if (!salt || !flexformId || !subAccountNumber || !transactionId || !initialPrice) {
            throw new kernel_1.EntityNotFoundException();
        }
        const formDigest = crypto.createHash('md5')
            .update(`${initialPrice}${initialPeriod}${initialPrice}${initialPeriod}99${currencyCode}${salt}`).digest('hex');
        return {
            paymentUrl: `https://api.ccbill.com/wap-frontflex/flexforms/${flexformId}?transactionId=${transactionId}&initialPrice=${initialPrice}&initialPeriod=${initialPeriod}&recurringPrice=${initialPrice}&recurringPeriod=${initialPeriod}&numRebills=99&clientSubacc=${subAccountNumber}&currencyCode=${currencyCode}&formDigest=${formDigest}`
        };
    }
    singlePurchase(options) {
        const { transactionId } = options;
        const { salt } = options;
        const { flexformId } = options;
        const { subAccountNumber } = options;
        const initialPrice = options.price.toFixed(2);
        const currencyCode = '840';
        const initialPeriod = 30;
        if (!salt || !flexformId || !subAccountNumber || !transactionId || !initialPrice) {
            throw new kernel_1.EntityNotFoundException();
        }
        const formDigest = crypto.createHash('md5')
            .update(`${initialPrice}${initialPeriod}${currencyCode}${salt}`)
            .digest('hex');
        return {
            paymentUrl: `https://api.ccbill.com/wap-frontflex/flexforms/${flexformId}?transactionId=${transactionId}&initialPrice=${initialPrice}&initialPeriod=${initialPeriod}&clientSubacc=${subAccountNumber}&currencyCode=${currencyCode}&formDigest=${formDigest}`
        };
    }
    async cancelSubscription(options) {
        var _a;
        const ccbillCancelUrl = 'https://datalink.ccbill.com/utils/subscriptionManagement.cgi';
        const { subscriptionId, ccbillClientAccNo, ccbillDatalinkUsername, ccbillDatalinkPassword } = options;
        const resp = await axios_1.default.get(`${ccbillCancelUrl}?subscriptionId=${subscriptionId}&username=${ccbillDatalinkUsername}&password=${ccbillDatalinkPassword}&action=cancelSubscription&clientAccnum=${ccbillClientAccNo}`);
        return (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.includes('"results"\n"1"\n');
    }
};
CCBillService = __decorate([
    common_1.Injectable()
], CCBillService);
exports.CCBillService = CCBillService;
//# sourceMappingURL=ccbill.service.js.map