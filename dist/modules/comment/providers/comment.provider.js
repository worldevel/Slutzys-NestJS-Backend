"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentProviders = exports.COMMENT_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const comment_schema_1 = require("../schemas/comment.schema");
exports.COMMENT_MODEL_PROVIDER = 'COMMENT_MODEL_PROVIDER';
exports.commentProviders = [
    {
        provide: exports.COMMENT_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Comment', comment_schema_1.CommentSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=comment.provider.js.map