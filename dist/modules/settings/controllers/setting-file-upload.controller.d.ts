import { FileDto } from 'src/modules/file';
import { UserDto } from '../../user/dtos';
export declare class SettingFileUploadController {
    uploadFile(user: UserDto, file: FileDto): Promise<any>;
}
