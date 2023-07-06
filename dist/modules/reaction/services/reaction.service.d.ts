import { Model } from 'mongoose';
import { PageableData, QueueEventService } from 'src/kernel';
import { ObjectId } from 'mongodb';
import { VideoService } from 'src/modules/performer-assets/services/video.service';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { OrderService } from 'src/modules/payment/services';
import { FileService } from 'src/modules/file/services';
import { ReactionModel } from '../models/reaction.model';
import { ReactionCreatePayload, ReactionSearchRequestPayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { ReactionDto } from '../dtos/reaction.dto';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
export declare class ReactionService {
    private readonly performerService;
    private readonly videoService;
    private readonly subscriptionService;
    private readonly orderService;
    private readonly userService;
    private readonly fileService;
    private readonly reactionModel;
    private readonly queueEventService;
    constructor(performerService: PerformerService, videoService: VideoService, subscriptionService: SubscriptionService, orderService: OrderService, userService: UserService, fileService: FileService, reactionModel: Model<ReactionModel>, queueEventService: QueueEventService);
    findByQuery(payload: any): Promise<ReactionModel[]>;
    create(data: ReactionCreatePayload, user: UserDto): Promise<ReactionDto>;
    remove(payload: ReactionCreatePayload, user: UserDto): Promise<boolean>;
    search(req: ReactionSearchRequestPayload): Promise<PageableData<ReactionDto>>;
    getListVideos(req: ReactionSearchRequestPayload, user: UserDto, jwToken: string): Promise<{
        data: ReactionDto[];
        total: number;
    }>;
    checkExisting(objectId: string | ObjectId, userId: string | ObjectId, action: string, objectType: string): Promise<number>;
}
