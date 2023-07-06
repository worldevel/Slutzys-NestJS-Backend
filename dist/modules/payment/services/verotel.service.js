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
exports.VerotelService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const lodash_1 = require("lodash");
const constants_2 = require("../constants");
let VerotelService = class VerotelService {
    constructor(settingService) {
        this.settingService = settingService;
    }
    async createSingleRequestFromTransaction(transaction, options) {
        const [VEROTEL_ENABLED, VEROTEL_API_VERSION, VEROTEL_CURRENCY, VEROTEL_FLEXPAY_SIGNATURE_KEY, VEROTEL_SHOP_ID, VEROTEL_TEST_MODE] = await Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_ENABLED),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_API_VERSION),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_CURRENCY),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_FLEXPAY_SIGNATURE_KEY),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_SHOP_ID),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_TEST_MODE)
        ]);
        if (!VEROTEL_ENABLED)
            throw new Error('Flexpay is not enabled!');
        const description = (options === null || options === void 0 ? void 0 : options.description) || `One time payment for ${transaction.type}`;
        const priceAmount = transaction.totalPrice.toFixed(2);
        const shasum = crypto_1.createHash('sha1');
        shasum.update(`${VEROTEL_FLEXPAY_SIGNATURE_KEY}:custom1=${options === null || options === void 0 ? void 0 : options.userId}:description=${description}:priceAmount=${priceAmount}:priceCurrency=${VEROTEL_CURRENCY}:referenceID=${transaction._id}:shopID=${VEROTEL_SHOP_ID}:type=purchase:version=${VEROTEL_API_VERSION}`);
        const signature = shasum.digest('hex');
        const payUrl = new URL(VEROTEL_TEST_MODE
            ? 'https://secure.verotel.com/startorder'
            : 'https://secure.billing.creditcard/startorder');
        payUrl.searchParams.append('custom1', options === null || options === void 0 ? void 0 : options.userId);
        payUrl.searchParams.append('description', description);
        payUrl.searchParams.append('priceAmount', priceAmount);
        payUrl.searchParams.append('priceCurrency', VEROTEL_CURRENCY);
        payUrl.searchParams.append('referenceID', transaction._id);
        payUrl.searchParams.append('shopID', VEROTEL_SHOP_ID);
        payUrl.searchParams.append('type', 'purchase');
        payUrl.searchParams.append('version', VEROTEL_API_VERSION);
        payUrl.searchParams.append('signature', signature);
        return {
            paymentUrl: payUrl.href,
            signature
        };
    }
    async createRecurringRequestFromTransaction(transaction, options) {
        const [VEROTEL_ENABLED, VEROTEL_API_VERSION, VEROTEL_CURRENCY, VEROTEL_FLEXPAY_SIGNATURE_KEY, VEROTEL_SHOP_ID, VEROTEL_TEST_MODE] = await Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_ENABLED),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_API_VERSION),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_CURRENCY),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_FLEXPAY_SIGNATURE_KEY),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_SHOP_ID),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_TEST_MODE)
        ]);
        if (!VEROTEL_ENABLED)
            throw new Error('Flexpay is not enabled!');
        const description = (options === null || options === void 0 ? void 0 : options.description) || `Recurring payment for ${transaction.type}`;
        const priceAmount = transaction.totalPrice.toFixed(2);
        const period = transaction.type === constants_2.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION ? 'P30D' : 'P1Y';
        const shasum = crypto_1.createHash('sha1');
        shasum.update(`${VEROTEL_FLEXPAY_SIGNATURE_KEY}:custom1=${options.userId}:custom2=${options.performerId}:custom3=${transaction.type}:description=${description}:period=${period}:priceAmount=${priceAmount}:priceCurrency=${VEROTEL_CURRENCY}:referenceID=${transaction._id}:shopID=${VEROTEL_SHOP_ID}:subscriptionType=recurring:type=subscription:version=${VEROTEL_API_VERSION}`);
        const signature = shasum.digest('hex');
        const payUrl = new URL(VEROTEL_TEST_MODE
            ? 'https://secure.verotel.com/startorder'
            : 'https://secure.billing.creditcard/startorder');
        payUrl.searchParams.append('custom1', options.userId);
        payUrl.searchParams.append('custom2', options.performerId);
        payUrl.searchParams.append('custom3', transaction.type);
        payUrl.searchParams.append('description', description);
        payUrl.searchParams.append('period', period);
        payUrl.searchParams.append('priceAmount', priceAmount);
        payUrl.searchParams.append('priceCurrency', VEROTEL_CURRENCY);
        payUrl.searchParams.append('referenceID', transaction._id);
        payUrl.searchParams.append('shopID', VEROTEL_SHOP_ID);
        payUrl.searchParams.append('subscriptionType', 'recurring');
        payUrl.searchParams.append('type', 'subscription');
        payUrl.searchParams.append('version', VEROTEL_API_VERSION);
        payUrl.searchParams.append('signature', signature);
        return {
            paymentUrl: payUrl.href,
            signature
        };
    }
    async isValidSignatureFromQuery(query) {
        const [VEROTEL_FLEXPAY_SIGNATURE_KEY] = await Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.VEROTEL_FLEXPAY_SIGNATURE_KEY)
        ]);
        const arr = [];
        Object.keys(query).forEach((key) => {
            if (key !== 'signature') {
                arr.push({
                    key,
                    value: query[key]
                });
            }
        });
        const sortArr = lodash_1.sortBy(arr, ['key']).map((item) => `${item.key}=${item.value}`);
        const txtToJoin = `${VEROTEL_FLEXPAY_SIGNATURE_KEY}:${sortArr.join(':')}`;
        const shasum = crypto_1.createHash('sha1');
        shasum.update(txtToJoin);
        const signature = shasum.digest('hex');
        return signature === query.signature;
    }
};
VerotelService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => settings_1.SettingService))),
    __metadata("design:paramtypes", [settings_1.SettingService])
], VerotelService);
exports.VerotelService = VerotelService;
//# sourceMappingURL=verotel.service.js.map