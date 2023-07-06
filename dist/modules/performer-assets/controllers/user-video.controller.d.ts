import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { VideoService } from '../services/video.service';
import { VideoSearchRequest } from '../payloads';
import { VideoSearchService } from '../services/video-search.service';
import { AuthService } from '../../auth/services';
export declare class UserVideosController {
    private readonly videoService;
    private readonly videoSearchService;
    private readonly authService;
    constructor(videoService: VideoService, videoSearchService: VideoSearchService, authService: AuthService);
    search(req: VideoSearchRequest): Promise<DataResponse<import("../../../kernel").PageableData<import("../dtos").VideoDto>>>;
    checkAuth(req: any): Promise<DataResponse<boolean>>;
    details(id: string, user: UserDto, req: any): Promise<DataResponse<import("../dtos").VideoDto>>;
    increaseViewStats(id: string): Promise<DataResponse<any>>;
}
