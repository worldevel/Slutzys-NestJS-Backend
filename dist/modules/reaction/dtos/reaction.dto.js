"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionDto = void 0;
const lodash_1 = require("lodash");
class ReactionDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            'source',
            'action',
            'objectId',
            'objectType',
            'createdBy',
            'creator',
            'createdAt',
            'updatedAt',
            'objectInfo',
            'isSubscribed',
            'isBought'
        ]));
    }
}
exports.ReactionDto = ReactionDto;
//# sourceMappingURL=reaction.dto.js.map