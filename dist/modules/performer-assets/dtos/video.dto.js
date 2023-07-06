"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IVideoResponse = exports.VideoDto = void 0;
const lodash_1 = require("lodash");
class VideoDto {
    constructor(init) {
        Object.assign(this, lodash_1.pick(init, [
            '_id',
            'performerId',
            'fileId',
            'type',
            'title',
            'slug',
            'description',
            'status',
            'processing',
            'thumbnailId',
            'teaserId',
            'teaser',
            'teaserProcessing',
            'isSchedule',
            'isSaleVideo',
            'price',
            'video',
            'thumbnail',
            'performer',
            'tags',
            'stats',
            'createdBy',
            'updatedBy',
            'scheduledAt',
            'createdAt',
            'updatedAt',
            'participantIds',
            'participants',
            'tagline',
            'isBought',
            'isSubscribed',
            'isLiked',
            'isFavourited',
            'isWishlist'
        ]));
    }
}
exports.VideoDto = VideoDto;
class IVideoResponse {
    constructor(init) {
        Object.assign(this, lodash_1.pick(init, [
            '_id',
            'performerId',
            'fileId',
            'type',
            'title',
            'description',
            'status',
            'processing',
            'thumbnailId',
            'teaserId',
            'teaser',
            'teaserProcessing',
            'isSchedule',
            'isSaleVideo',
            'price',
            'video',
            'thumbnail',
            'performer',
            'tags',
            'stats',
            'isBought',
            'isSubscribed',
            'isLiked',
            'isFavourited',
            'isWishlist',
            'createdBy',
            'updatedBy',
            'scheduledAt',
            'createdAt',
            'updatedAt',
            'participantIds',
            'participants'
        ]));
    }
}
exports.IVideoResponse = IVideoResponse;
//# sourceMappingURL=video.dto.js.map