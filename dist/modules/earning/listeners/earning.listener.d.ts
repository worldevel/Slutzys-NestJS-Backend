import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { SettingService } from 'src/modules/settings';
import { EarningDto } from '../dtos/earning.dto';
import { EarningModel } from '../models/earning.model';
export declare class TransactionEarningListener {
    private readonly settingService;
    private readonly performerService;
    private readonly earningModel;
    private readonly queueEventService;
    constructor(settingService: SettingService, performerService: PerformerService, earningModel: Model<EarningModel>, queueEventService: QueueEventService);
    handleListenEarning(event: QueueEvent): Promise<EarningDto>;
}
