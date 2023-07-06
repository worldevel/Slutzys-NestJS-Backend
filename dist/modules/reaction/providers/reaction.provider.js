"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionProviders = exports.REACT_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const reaction_schema_1 = require("../schemas/reaction.schema");
exports.REACT_MODEL_PROVIDER = 'REACT_MODEL_PROVIDER';
exports.reactionProviders = [
    {
        provide: exports.REACT_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('React', reaction_schema_1.ReactSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=reaction.provider.js.map