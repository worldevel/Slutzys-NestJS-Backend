import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { UserDto } from 'src/modules/user/dtos';
import { CountryService } from 'src/modules/utils/services';
import { PerformerDto, IPerformerResponse } from '../dtos';
import { SelfUpdatePayload, PerformerSearchPayload, BankingSettingPayload, PaymentGatewaySettingPayload } from '../payloads';
import { PerformerService, PerformerSearchService } from '../services';
export declare class PerformerController {
    private readonly performerService;
    private readonly performerSearchService;
    private readonly authService;
    private readonly countryService;
    private readonly fileService;
    constructor(performerService: PerformerService, performerSearchService: PerformerSearchService, authService: AuthService, countryService: CountryService, fileService: FileService);
    me(req: any): Promise<DataResponse<IPerformerResponse>>;
    usearch(query: PerformerSearchPayload, req: any, user: UserDto): Promise<DataResponse<PageableData<IPerformerResponse>>>;
    updateUser(payload: SelfUpdatePayload, performerId: string, req: any): Promise<DataResponse<IPerformerResponse>>;
    getDetails(performerUsername: string, req: any, user: UserDto): Promise<DataResponse<Partial<PerformerDto>>>;
    uploadPerformerDocument(currentUser: UserDto, file: FileDto, req: any): Promise<any>;
    updatePaymentGatewaySetting(payload: PaymentGatewaySettingPayload): Promise<DataResponse<import("../models").PaymentGatewaySettingModel>>;
    uploadPerformerAvatar(file: FileDto, performer: PerformerDto): Promise<any>;
    uploadPerformerCover(file: FileDto, performer: PerformerDto): Promise<any>;
    uploadPerformerVideo(file: FileDto, performer: PerformerDto): Promise<any>;
    updateBankingSetting(performerId: string, payload: BankingSettingPayload, user: UserDto): Promise<DataResponse<import("../models").BankingModel>>;
    checkAuth(req: any): Promise<DataResponse<boolean>>;
}
