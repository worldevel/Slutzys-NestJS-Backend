"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockProviders = exports.SITE_BLOCK_COUNTRY_PROVIDER = exports.PERFORMER_BLOCK_USER_PROVIDER = exports.PERFORMER_BLOCK_COUNTRY_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.PERFORMER_BLOCK_COUNTRY_PROVIDER = 'PERFORMER_BLOCK_COUNTRY_PROVIDER';
exports.PERFORMER_BLOCK_USER_PROVIDER = 'PERFORMER_BLOCK_USER_PROVIDER';
exports.SITE_BLOCK_COUNTRY_PROVIDER = 'SITE_BLOCK_COUNTRY_PROVIDER';
exports.blockProviders = [
    {
        provide: exports.PERFORMER_BLOCK_COUNTRY_PROVIDER,
        useFactory: (connection) => connection.model('PerformerBlockCountries', schemas_1.PerformerBlockCountrySchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PERFORMER_BLOCK_USER_PROVIDER,
        useFactory: (connection) => connection.model('PerformerBlockUsers', schemas_1.PerformerBlockUserSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.SITE_BLOCK_COUNTRY_PROVIDER,
        useFactory: (connection) => connection.model('SiteBlockCountry', schemas_1.BlockCountrySchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map