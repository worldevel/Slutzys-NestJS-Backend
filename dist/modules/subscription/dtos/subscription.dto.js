"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDto = void 0;
const lodash_1 = require("lodash");
class SubscriptionDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'subscriptionType',
            'userInfo',
            'userId',
            'performerId',
            'performerInfo',
            'subscriptionId',
            'transactionId',
            'paymentGateway',
            'status',
            'meta',
            'startRecurringDate',
            'nextRecurringDate',
            'expiredAt',
            'createdAt',
            'updatedAt',
            'blockedUser'
        ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            subscriptionType: this.subscriptionType,
            userId: this.userId,
            userInfo: this.userInfo,
            performerId: this.performerId,
            performerInfo: this.performerInfo,
            status: this.status,
            expiredAt: this.expiredAt,
            blockedUser: this.blockedUser,
            startRecurringDate: this.startRecurringDate,
            nextRecurringDate: this.nextRecurringDate,
            paymentGateway: this.paymentGateway,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
        const privateInfo = {
            subscriptionId: this.subscriptionId,
            transactionId: this.transactionId,
            meta: this.meta
        };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
}
exports.SubscriptionDto = SubscriptionDto;
//# sourceMappingURL=subscription.dto.js.map