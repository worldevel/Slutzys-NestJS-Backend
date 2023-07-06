"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordIncorrectException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class PasswordIncorrectException extends common_1.HttpException {
    constructor() {
        super(constants_1.PASSWORD_INCORRECT, 422);
    }
}
exports.PasswordIncorrectException = PasswordIncorrectException;
//# sourceMappingURL=password-incorrect.exception.js.map