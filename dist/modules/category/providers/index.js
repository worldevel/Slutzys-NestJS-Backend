"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryProviders = exports.CATEGORY_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.CATEGORY_PROVIDER = 'CATEGORY_PROVIDER';
exports.categoryProviders = [
    {
        provide: exports.CATEGORY_PROVIDER,
        useFactory: (connection) => connection.model('AssetCategory', schemas_1.CategorySchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map