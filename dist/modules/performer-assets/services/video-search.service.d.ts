import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { UserDto } from 'src/modules/user/dtos';
import { VideoDto } from '../dtos';
import { VideoSearchRequest } from '../payloads';
import { VideoModel } from '../models';
export declare class VideoSearchService {
    private readonly performerService;
    private readonly videoModel;
    private readonly fileService;
    constructor(performerService: PerformerService, videoModel: Model<VideoModel>, fileService: FileService);
    adminSearch(req: VideoSearchRequest): Promise<PageableData<VideoDto>>;
    performerSearch(req: VideoSearchRequest, performer?: UserDto): Promise<PageableData<VideoDto>>;
    userSearch(req: VideoSearchRequest): Promise<PageableData<VideoDto>>;
}
