"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProviders = exports.POST_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.POST_MODEL_PROVIDER = 'POST_MODEL';
exports.postProviders = [
    {
        provide: exports.POST_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Post', schemas_1.PostSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=post.provider.js.map