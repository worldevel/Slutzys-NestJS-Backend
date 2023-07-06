import { DataResponse, PageableData } from 'src/kernel';
import { ReportService } from '../services/report.service';
import { ReportCreatePayload, ReportSearchRequestPayload } from '../payloads';
import { ReportDto } from '../dtos/report.dto';
import { UserDto } from '../../user/dtos';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    create(user: UserDto, payload: ReportCreatePayload): Promise<DataResponse<ReportDto>>;
    remove(id: string): Promise<DataResponse<any>>;
    rejectReport(id: string): Promise<DataResponse<any>>;
    adminList(query: ReportSearchRequestPayload): Promise<DataResponse<PageableData<ReportDto>>>;
    performerList(query: ReportSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<ReportDto>>>;
}
