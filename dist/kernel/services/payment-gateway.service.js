"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayService = void 0;
const crypto = require("crypto");
class PaymentGatewayService {
    getBaseURL() {
        return this.baseURL;
    }
    setBaseURL(baseURL) {
        this.baseURL = baseURL;
    }
    encode(data) {
        const { type, id } = data;
        if (!data || !id) {
            return null;
        }
        return [type, id].join('-');
    }
    decode(data) {
        return data.split('-');
    }
    createHash(algorithm, data, encoding) {
        return crypto
            .createHash(algorithm)
            .update(data)
            .digest(encoding);
    }
    buildQueryString(query) {
        return new URLSearchParams(query).toString();
    }
}
exports.PaymentGatewayService = PaymentGatewayService;
//# sourceMappingURL=payment-gateway.service.js.map