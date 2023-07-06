export interface IConvertOptions {
    toPath?: string;
    size?: string;
}
export interface IConvertResponse {
    fileName: string;
    toPath: string;
}
export declare class VideoFileService {
    convert2Mp4(filePath: string, options?: IConvertOptions): Promise<IConvertResponse>;
    getMetaData(filePath: string): Promise<any>;
    createThumbs(filePath: string, options: {
        toFolder: string;
        count?: number;
        size?: string;
    }): Promise<string[]>;
}
