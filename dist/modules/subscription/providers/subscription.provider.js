"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionProviders = exports.SUBSCRIPTION_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const subscription_schema_1 = require("../schemas/subscription.schema");
exports.SUBSCRIPTION_MODEL_PROVIDER = 'SUBSCRIPTION_MODEL_PROVIDER';
exports.subscriptionProviders = [
    {
        provide: exports.SUBSCRIPTION_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('UserSubscription', subscription_schema_1.SubscriptionSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=subscription.provider.js.map