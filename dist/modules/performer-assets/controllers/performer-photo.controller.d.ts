import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PhotoCreatePayload, PhotoUpdatePayload, PhotoSearchRequest } from '../payloads';
import { PhotoService } from '../services/photo.service';
import { PhotoSearchService } from '../services/photo-search.service';
import { AuthService } from '../../auth/services';
export declare class PerformerPhotoController {
    private readonly photoService;
    private readonly photoSearchService;
    private readonly authService;
    constructor(photoService: PhotoService, photoSearchService: PhotoSearchService, authService: AuthService);
    upload(files: Record<string, any>, payload: PhotoCreatePayload, creator: UserDto): Promise<any>;
    update(id: string, payload: PhotoUpdatePayload, updater: UserDto): Promise<DataResponse<import("../dtos").PhotoDto>>;
    setCoverGallery(id: string, updater: UserDto): Promise<DataResponse<import("../dtos").PhotoDto>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    search(query: PhotoSearchRequest, user: UserDto, req: any): Promise<DataResponse<import("../../../kernel").PageableData<import("../dtos").PhotoDto>>>;
    details(id: string): Promise<DataResponse<import("../dtos").PhotoDto>>;
    checkAuth(req: any): Promise<DataResponse<boolean>>;
}
