import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { VideoService } from 'src/modules/performer-assets/services';
import { MailerService } from 'src/modules/mailer';
import { ReportModel } from '../models/report.model';
import { ReportSearchRequestPayload, ReportCreatePayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { ReportDto } from '../dtos/report.dto';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
export declare class ReportService {
    private readonly videoService;
    private readonly performerService;
    private readonly userService;
    private readonly reportModel;
    private readonly mailService;
    constructor(videoService: VideoService, performerService: PerformerService, userService: UserService, reportModel: Model<ReportModel>, mailService: MailerService);
    create(payload: ReportCreatePayload, user: UserDto): Promise<ReportDto>;
    rejectReport(id: any): Promise<{
        success: boolean;
    }>;
    remove(id: any): Promise<{
        deleted: boolean;
    }>;
    adminSearch(req: ReportSearchRequestPayload): Promise<PageableData<ReportDto>>;
    performerSearch(req: ReportSearchRequestPayload, user: UserDto): Promise<PageableData<ReportDto>>;
}
