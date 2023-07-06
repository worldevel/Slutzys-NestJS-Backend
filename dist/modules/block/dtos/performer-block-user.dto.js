"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerBlockUserDto = void 0;
const lodash_1 = require("lodash");
class PerformerBlockUserDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'source',
            'sourceId',
            'reason',
            'target',
            'targetId',
            'targetInfo',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.PerformerBlockUserDto = PerformerBlockUserDto;
//# sourceMappingURL=performer-block-user.dto.js.map