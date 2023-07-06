import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { PerformerCreatePayload, PerformerUpdatePayload, PerformerSearchPayload, PaymentGatewaySettingPayload, CommissionSettingPayload, BankingSettingPayload } from '../payloads';
import { PerformerDto, IPerformerResponse } from '../dtos';
import { PerformerService, PerformerSearchService } from '../services';
export declare class AdminPerformerController {
    private readonly performerService;
    private readonly performerSearchService;
    private readonly authService;
    private readonly fileService;
    constructor(performerService: PerformerService, performerSearchService: PerformerSearchService, authService: AuthService, fileService: FileService);
    search(req: PerformerSearchPayload): Promise<DataResponse<PageableData<IPerformerResponse>>>;
    create(currentUser: UserDto, payload: PerformerCreatePayload): Promise<DataResponse<PerformerDto>>;
    updateUser(payload: PerformerUpdatePayload, performerId: string, req: any): Promise<DataResponse<PerformerDto>>;
    getDetails(performerId: string, req: any): Promise<DataResponse<IPerformerResponse>>;
    uploadPerformerDocument(file: FileDto, id: any, req: any): Promise<any>;
    uploadPerformerAvatar(file: FileDto): Promise<any>;
    uploadPerformerCover(file: FileDto): Promise<any>;
    updatePaymentGatewaySetting(payload: PaymentGatewaySettingPayload): Promise<DataResponse<import("../models").PaymentGatewaySettingModel>>;
    updateCommissionSetting(performerId: string, payload: CommissionSettingPayload): Promise<DataResponse<import("../models").CommissionSettingModel>>;
    updateBankingSetting(performerId: string, payload: BankingSettingPayload, user: UserDto): Promise<DataResponse<import("../models").BankingModel>>;
}
