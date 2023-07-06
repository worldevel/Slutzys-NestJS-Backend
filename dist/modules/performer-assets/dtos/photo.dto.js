"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoDto = void 0;
const lodash_1 = require("lodash");
class PhotoDto {
    constructor(init) {
        Object.assign(this, lodash_1.pick(init, [
            '_id',
            'performerId',
            'galleryId',
            'fileId',
            'photo',
            'type',
            'title',
            'description',
            'status',
            'processing',
            'price',
            'isGalleryCover',
            'performer',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.PhotoDto = PhotoDto;
//# sourceMappingURL=photo.dto.js.map