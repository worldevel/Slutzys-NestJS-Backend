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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const dtos_1 = require("../../performer/dtos");
const services_1 = require("../../performer-assets/services");
const dtos_2 = require("../../performer-assets/dtos");
const mailer_1 = require("../../mailer");
const providers_1 = require("../providers");
const dtos_3 = require("../../user/dtos");
const report_dto_1 = require("../dtos/report.dto");
const services_2 = require("../../user/services");
const services_3 = require("../../performer/services");
const constants_1 = require("../constants");
let ReportService = class ReportService {
    constructor(videoService, performerService, userService, reportModel, mailService) {
        this.videoService = videoService;
        this.performerService = performerService;
        this.userService = userService;
        this.reportModel = reportModel;
        this.mailService = mailService;
    }
    async create(payload, user) {
        const existReport = await this.reportModel.findOne({
            target: payload.target,
            targetId: payload.targetId,
            sourceId: user._id
        });
        if (existReport) {
            existReport.title = payload.title;
            existReport.description = payload.description;
            existReport.updatedAt = new Date();
            await existReport.save();
            return existReport;
        }
        const data = Object.assign({}, payload);
        data.sourceId = user._id;
        data.source = 'user';
        data.createdAt = new Date();
        data.updatedAt = new Date();
        const newreport = await this.reportModel.create(data);
        return newreport;
    }
    async rejectReport(id) {
        const report = await this.reportModel.findById(id);
        if (!report)
            throw new kernel_1.EntityNotFoundException();
        if (report.status !== constants_1.REPORT_STATUSES.REPORTED) {
            throw new common_1.ForbiddenException();
        }
        report.status = constants_1.REPORT_STATUSES.REJECTED;
        await report.save();
        return { success: true };
    }
    async remove(id) {
        const report = await this.reportModel.findById(id);
        if (!report) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (report.status === constants_1.REPORT_STATUSES.DELETED) {
            throw new common_1.HttpException('Report object was deleted!', 422);
        }
        report.status = constants_1.REPORT_STATUSES.DELETED;
        report.updatedAt = new Date();
        await report.save();
        if (report.target === constants_1.REPORT_TARGET.VIDEO) {
            const [performer, video] = await Promise.all([
                this.performerService.findById(report.performerId),
                this.videoService.findById(report.targetId)
            ]);
            (performer === null || performer === void 0 ? void 0 : performer.email) && video && await this.mailService.send({
                subject: 'Video Violation',
                to: performer === null || performer === void 0 ? void 0 : performer.email,
                data: {
                    videoTitle: video === null || video === void 0 ? void 0 : video.title
                },
                template: 'model-report-notify'
            });
            video && await this.videoService.delete(video._id);
        }
        return { deleted: true };
    }
    async adminSearch(req) {
        const query = {};
        if (req.sourceId) {
            query.sourceId = req.sourceId;
        }
        if (req.source) {
            query.source = req.source;
        }
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.targetId) {
            query.targetId = req.targetId;
        }
        if (req.target) {
            query.target = req.target;
        }
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.reportModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.reportModel.countDocuments(query)
        ]);
        const reports = data.map((d) => new report_dto_1.ReportDto(d));
        const UIds = lodash_1.uniq(data.map((d) => d.sourceId));
        const performerIds = lodash_1.uniq(data.map((d) => d.performerId));
        const targetIds = lodash_1.uniq(data.map((d) => d.targetId));
        const [users, performers, videos] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            targetIds.length ? this.videoService.findByIds(targetIds) : []
        ]);
        reports.forEach((report) => {
            const user = users.find((u) => u._id.toString() === report.sourceId.toString());
            const performer = performers.find((p) => p._id.toString() === report.performerId.toString());
            const video = videos.find((v) => v._id.toString() === report.targetId.toString());
            report.sourceInfo = user ? new dtos_3.UserDto(user).toResponse() : null;
            report.performerInfo = performer ? new dtos_1.PerformerDto(performer).toResponse() : null;
            report.targetInfo = video ? new dtos_2.VideoDto(video) : null;
        });
        return {
            data: reports,
            total
        };
    }
    async performerSearch(req, user) {
        const query = {
            performerId: user._id
        };
        if (req.sourceId) {
            query.sourceId = req.sourceId;
        }
        if (req.source) {
            query.source = req.source;
        }
        if (req.targetId) {
            query.targetId = req.targetId;
        }
        if (req.target) {
            query.target = req.target;
        }
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.reportModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit ? parseInt(req.limit, 10) : 10)
                .skip(parseInt(req.offset, 10)),
            this.reportModel.countDocuments(query)
        ]);
        const reports = data.map((d) => new report_dto_1.ReportDto(d));
        const UIds = lodash_1.uniq(data.map((d) => d.sourceId));
        const performerIds = lodash_1.uniq(data.map((d) => d.performerId));
        const targetIds = lodash_1.uniq(data.map((d) => d.targetId));
        const [users, performers, videos] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            targetIds.length ? this.videoService.findByIds(targetIds) : []
        ]);
        reports.forEach((report) => {
            const userInfo = users.find((u) => u._id.toString() === report.sourceId.toString());
            const performer = performers.find((p) => p._id.toString() === report.performerId.toString());
            const video = videos.find((v) => v._id.toString() === report.targetId.toString());
            report.sourceInfo = userInfo ? new dtos_3.UserDto(userInfo).toResponse() : null;
            report.performerInfo = performer ? new dtos_1.PerformerDto(performer).toResponse() : null;
            report.targetInfo = video ? new dtos_2.VideoDto(video) : null;
        });
        return {
            data: reports,
            total
        };
    }
};
ReportService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.VideoService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_3.PerformerService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_2.UserService))),
    __param(3, common_1.Inject(providers_1.REPORT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.VideoService,
        services_3.PerformerService,
        services_2.UserService,
        mongoose_1.Model,
        mailer_1.MailerService])
], ReportService);
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map