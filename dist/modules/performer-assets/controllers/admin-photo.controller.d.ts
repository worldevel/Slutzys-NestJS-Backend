import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PhotoCreatePayload, PhotoUpdatePayload, PhotoSearchRequest } from '../payloads';
import { PhotoService } from '../services/photo.service';
import { PhotoSearchService } from '../services/photo-search.service';
export declare class AdminPerformerPhotoController {
    private readonly photoService;
    private readonly photoSearchService;
    constructor(photoService: PhotoService, photoSearchService: PhotoSearchService);
    upload(files: Record<string, any>, payload: PhotoCreatePayload, creator: UserDto): Promise<any>;
    update(id: string, payload: PhotoUpdatePayload, updater: UserDto): Promise<DataResponse<import("../dtos").PhotoDto>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    search(query: PhotoSearchRequest, req: any): Promise<DataResponse<import("../../../kernel").PageableData<import("../dtos").PhotoDto>>>;
    details(id: string): Promise<DataResponse<import("../dtos").PhotoDto>>;
}
