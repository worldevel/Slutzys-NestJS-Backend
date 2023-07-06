/// <reference types="node" />
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ConfigService } from 'nestjs-config';
import { QueueEventService } from 'src/kernel';
import { FileModel } from '../models';
import { IMulterUploadedFile } from '../lib/multer/multer.utils';
import { FileDto } from '../dtos';
import { IFileUploadOptions } from '../lib';
import { ImageService } from './image.service';
import { VideoFileService } from './video.service';
export declare const FILE_EVENT: {
    VIDEO_PROCESSED: string;
    PHOTO_PROCESSED: string;
};
export declare class FileService {
    private readonly config;
    private readonly fileModel;
    private readonly imageService;
    private readonly videoService;
    private readonly queueEventService;
    constructor(config: ConfigService, fileModel: Model<FileModel>, imageService: ImageService, videoService: VideoFileService, queueEventService: QueueEventService);
    findById(id: string | ObjectId): Promise<FileDto>;
    findByIds(ids: string[] | ObjectId[]): Promise<FileDto[]>;
    countByRefType(itemType: string): Promise<any>;
    findByRefType(itemType: string, limit: number, offset: number): Promise<any>;
    createFromMulter(type: string, multerData: IMulterUploadedFile, options?: IFileUploadOptions): Promise<FileDto>;
    addRef(fileId: ObjectId, ref: {
        itemId: ObjectId;
        itemType: string;
    }): Promise<any>;
    remove(fileId: string | ObjectId): Promise<boolean>;
    removeIfNotHaveRef(fileId: string | ObjectId): Promise<boolean>;
    queueProcessVideo(fileId: string | ObjectId, options?: {
        meta: Record<string, any>;
        publishChannel: string;
    }): Promise<boolean>;
    private _processVideo;
    queueProcessPhoto(fileId: string | ObjectId, options?: {
        meta?: Record<string, any>;
        publishChannel?: string;
        thumbnailSize?: {
            width: number;
            height: number;
        };
    }): Promise<boolean>;
    private _processPhoto;
    private generateJwt;
    generateDownloadLink(fileId: string | ObjectId): Promise<string>;
    getStreamToDownload(key: string): Promise<{
        file: FileModel;
        stream: import("fs").ReadStream;
    }>;
}
