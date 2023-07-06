import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { VideoCreatePayload } from '../payloads/video-create.payload';
import { VideoService } from '../services/video.service';
import { VideoSearchRequest, VideoUpdatePayload } from '../payloads';
import { VideoSearchService } from '../services/video-search.service';
export declare class PerformerVideosController {
    private readonly videoService;
    private readonly videoSearchService;
    constructor(videoService: VideoService, videoSearchService: VideoSearchService);
    uploadVideo(files: Record<string, any>, payload: VideoCreatePayload, uploader: UserDto): Promise<any>;
    details(id: string, req: any): Promise<DataResponse<import("../dtos").VideoDto>>;
    search(req: VideoSearchRequest, uploader: UserDto): Promise<DataResponse<import("../../../kernel").PageableData<import("../dtos").VideoDto>>>;
    update(files: Record<string, any>, id: string, payload: VideoUpdatePayload, updater: UserDto): Promise<DataResponse<import("../dtos").VideoDto>>;
    remove(id: string): Promise<DataResponse<boolean>>;
}
