"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDto = void 0;
const lodash_1 = require("lodash");
class ProductDto {
    constructor(init) {
        Object.assign(this, lodash_1.pick(init, [
            '_id',
            'performerId',
            'digitalFileId',
            'digitalFile',
            'imageIds',
            'images',
            'categoryIds',
            'categories',
            'type',
            'name',
            'slug',
            'description',
            'status',
            'price',
            'stock',
            'performer',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt',
            'stats',
            'isBought'
        ]));
    }
    toPublic() {
        return {
            _id: this._id,
            performerId: this.performerId,
            digitalFileId: this.digitalFileId,
            digitalFile: this.digitalFile,
            imageIds: this.imageIds,
            images: this.images,
            categoryIds: this.categoryIds,
            categories: this.categories,
            type: this.type,
            name: this.name,
            slug: this.slug,
            description: this.description,
            status: this.status,
            price: this.price,
            stock: this.stock,
            performer: this.performer,
            createdBy: this.createdBy,
            updatedBy: this.updatedBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            stats: this.stats,
            isBought: this.isBought
        };
    }
}
exports.ProductDto = ProductDto;
//# sourceMappingURL=product.dto.js.map