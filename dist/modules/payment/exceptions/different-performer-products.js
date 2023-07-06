"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DifferentPerformerException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class DifferentPerformerException extends common_1.HttpException {
    constructor() {
        super(constants_1.DIFFERENT_PERFORMER_PRODUCT, 400);
    }
}
exports.DifferentPerformerException = DifferentPerformerException;
//# sourceMappingURL=different-performer-products.js.map