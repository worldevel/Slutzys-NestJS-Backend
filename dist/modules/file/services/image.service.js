"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const sharp = require("sharp");
class ImageService {
    async createThumbnail(filePath, options) {
        options = options || {
            width: 200,
            height: 200
        };
        if (options.toPath) {
            return sharp(filePath)
                .resize(options.width, options.height)
                .rotate()
                .toFile(options.toPath);
        }
        return sharp(filePath)
            .resize(options.width, options.height)
            .rotate()
            .toBuffer();
    }
    async getMetaData(filePath) {
        return sharp(filePath).metadata();
    }
    async replaceWithoutExif(filePath) {
        return sharp(filePath)
            .rotate()
            .toBuffer();
    }
}
exports.ImageService = ImageService;
//# sourceMappingURL=image.service.js.map