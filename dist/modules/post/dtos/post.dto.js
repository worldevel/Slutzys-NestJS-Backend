"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDto = void 0;
const lodash_1 = require("lodash");
class PostDto {
    constructor(data) {
        this.type = 'post';
        this.categoryIds = [];
        this.status = 'draft';
        this.meta = [];
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'authorId',
            'type',
            'title',
            'slug',
            'ordering',
            'content',
            'shortDescription',
            'categoryIds',
            'status',
            'meta',
            'image',
            'updatedBy',
            'createdBy',
            'createdAt',
            'updatedAt'
        ]));
    }
    addAuthor(author) {
        this.author = {
            _id: author._id,
            name: author.name,
            avatar: author.avatar
        };
    }
}
exports.PostDto = PostDto;
//# sourceMappingURL=post.dto.js.map