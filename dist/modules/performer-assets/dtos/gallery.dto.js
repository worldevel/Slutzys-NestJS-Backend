"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryDto = void 0;
const lodash_1 = require("lodash");
class GalleryDto {
    constructor(init) {
        Object.assign(this, lodash_1.pick(init, [
            '_id',
            'performerId',
            'type',
            'name',
            'slug',
            'description',
            'status',
            'coverPhotoId',
            'price',
            'isSale',
            'coverPhoto',
            'performer',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt',
            'isLiked',
            'isSubscribed',
            'isBought',
            'stats',
            'numOfItems',
            'tags'
        ]));
    }
    static fromModel(model) {
        return new GalleryDto(model);
    }
}
exports.GalleryDto = GalleryDto;
//# sourceMappingURL=gallery.dto.js.map