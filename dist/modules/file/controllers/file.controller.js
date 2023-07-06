"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async downloadFile(response, key) {
        const info = await this.fileService.getStreamToDownload(key);
        response.setHeader('Content-Disposition', `attachment; filename=${info.file.name}`);
        info.stream.pipe(response);
    }
};
__decorate([
    common_1.Get('download'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Res()),
    __param(1, common_1.Query('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "downloadFile", null);
FileController = __decorate([
    common_1.Controller('files'),
    __metadata("design:paramtypes", [services_1.FileService])
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=file.controller.js.map