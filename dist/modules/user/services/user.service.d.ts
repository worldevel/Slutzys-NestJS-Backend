import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { FileDto } from 'src/modules/file';
import { QueueEventService } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserModel } from '../models';
import { UserUpdatePayload, UserAuthUpdatePayload, UserAuthCreatePayload, UserCreatePayload } from '../payloads';
import { UserDto } from '../dtos';
export declare class UserService {
    private readonly authService;
    private readonly performerService;
    private readonly userModel;
    private readonly queueEventService;
    constructor(authService: AuthService, performerService: PerformerService, userModel: Model<UserModel>, queueEventService: QueueEventService);
    find(params: any): Promise<UserModel[]>;
    findOne(params: any): Promise<UserModel>;
    findByEmail(email: string): Promise<UserModel | null>;
    findById(id: string | ObjectId): Promise<UserModel>;
    getMe(id: string | ObjectId, jwToken: string): Promise<any>;
    findByUsername(username: string): Promise<UserDto>;
    findByIds(ids: any[]): Promise<UserModel[]>;
    checkExistedEmailorUsername(payload: any): Promise<number>;
    create(data: UserCreatePayload | UserAuthCreatePayload, options?: any): Promise<UserModel>;
    socialCreate(data: any): Promise<UserModel>;
    update(id: string | ObjectId, payload: UserUpdatePayload, user?: UserDto): Promise<any>;
    updateAvatar(user: UserDto, file: FileDto): Promise<FileDto>;
    adminUpdate(id: string | ObjectId, payload: UserAuthUpdatePayload): Promise<boolean>;
    updateVerificationStatus(userId: string | ObjectId): Promise<any>;
    updateStats(id: string | ObjectId, payload: Record<string, number>): Promise<any>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
