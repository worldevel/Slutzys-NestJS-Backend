"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerDto = void 0;
const lodash_1 = require("lodash");
class BannerDto {
    constructor(init) {
        Object.assign(this, lodash_1.pick(init, [
            '_id',
            'fileId',
            'title',
            'description',
            'link',
            'status',
            'position',
            'photo',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.BannerDto = BannerDto;
//# sourceMappingURL=banner.dto.js.map