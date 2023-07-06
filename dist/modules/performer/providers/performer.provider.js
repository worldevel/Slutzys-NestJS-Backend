"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performerProviders = exports.PERFORMER_BANKING_SETTING_MODEL_PROVIDER = exports.PERFORMER_COMMISSION_SETTING_MODEL_PROVIDER = exports.PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER = exports.PERFORMER_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
const payment_gateway_setting_schema_1 = require("../schemas/payment-gateway-setting.schema");
exports.PERFORMER_MODEL_PROVIDER = 'PERFORMER_MODEL';
exports.PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER = 'PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER';
exports.PERFORMER_COMMISSION_SETTING_MODEL_PROVIDER = 'PERFORMER_COMMISSION_SETTING_MODEL_PROVIDER';
exports.PERFORMER_BANKING_SETTING_MODEL_PROVIDER = 'PERFORMER_BANKING_SETTING_MODEL_PROVIDER';
exports.performerProviders = [
    {
        provide: exports.PERFORMER_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Performer', schemas_1.PerformerSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerPaymentGatewaySetting', payment_gateway_setting_schema_1.PaymentGatewaySettingSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PERFORMER_COMMISSION_SETTING_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerCommissionSetting', schemas_1.CommissionSettingSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PERFORMER_BANKING_SETTING_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerBankingSetting', schemas_1.BankingSettingSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=performer.provider.js.map