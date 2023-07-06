import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { UserDto } from 'src/modules/user/dtos';
import { PhotoModel } from '../models';
import { PhotoDto } from '../dtos';
import { PhotoSearchRequest } from '../payloads';
import { GalleryService } from './gallery.service';
export declare class PhotoSearchService {
    private readonly performerService;
    private readonly photoModel;
    private readonly galleryService;
    private readonly fileService;
    constructor(performerService: PerformerService, photoModel: Model<PhotoModel>, galleryService: GalleryService, fileService: FileService);
    adminSearch(req: PhotoSearchRequest, jwToken: string): Promise<PageableData<PhotoDto>>;
    performerSearch(req: PhotoSearchRequest, user: UserDto, jwToken: string): Promise<PageableData<PhotoDto>>;
    getModelPhotosWithGalleryCheck(req: PhotoSearchRequest, jwToken: string): Promise<{
        data: PhotoDto[];
        total: number;
    }>;
    searchPhotos(req: PhotoSearchRequest, jwToken: string): Promise<{
        data: PhotoDto[];
        total: number;
    }>;
}
