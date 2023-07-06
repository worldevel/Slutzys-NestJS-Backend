import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { PerformerModel } from '../models';
export declare class PerformerConnectedListener {
    private readonly queueEventService;
    private readonly performerModel;
    constructor(queueEventService: QueueEventService, performerModel: Model<PerformerModel>);
    private handleOnlineOffline;
}
