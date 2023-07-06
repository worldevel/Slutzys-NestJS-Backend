import { SettingService } from 'src/modules/settings';
import { PaymentTransactionModel } from '../models';
export declare class VerotelService {
    private readonly settingService;
    constructor(settingService: SettingService);
    createSingleRequestFromTransaction(transaction: PaymentTransactionModel, options?: any): Promise<{
        paymentUrl: string;
        signature: string;
    }>;
    createRecurringRequestFromTransaction(transaction: PaymentTransactionModel, options: any): Promise<{
        paymentUrl: string;
        signature: string;
    }>;
    isValidSignatureFromQuery(query: any): Promise<boolean>;
}
