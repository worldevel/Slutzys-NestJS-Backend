import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { AuthModel, ForgotModel, VerificationModel } from '../models';
import { AuthCreateDto, AuthUpdateDto } from '../dtos';
export declare class AuthService {
    private readonly performerService;
    private readonly userService;
    private readonly authModel;
    private readonly verificationModel;
    private readonly forgotModel;
    private readonly mailService;
    constructor(performerService: PerformerService, userService: UserService, authModel: Model<AuthModel>, verificationModel: Model<VerificationModel>, forgotModel: Model<ForgotModel>, mailService: MailerService);
    generateSalt(byteSize?: number): string;
    encryptPassword(pw: string, salt: string): string;
    findOne(query: any): Promise<AuthModel>;
    find(query: any): Promise<AuthModel[]>;
    create(data: AuthCreateDto): Promise<AuthModel>;
    update(data: AuthUpdateDto): Promise<void>;
    updateKey(data: AuthUpdateDto): Promise<void>;
    findBySource(options: {
        source?: string;
        sourceId?: ObjectId;
        type?: string;
        key?: string;
    }): Promise<AuthModel | null>;
    verifyPassword(pw: string, auth: AuthModel): boolean;
    generateJWT(auth: any, options?: any): string;
    verifyJWT(token: string): any;
    getSourceFromJWT(jwtToken: string): Promise<any>;
    forgot(auth: AuthModel, source: {
        _id: ObjectId;
        email: string;
    }): Promise<boolean>;
    getForgot(token: string): Promise<ForgotModel>;
    sendVerificationEmail(source: {
        email: string;
        _id: ObjectId;
    }): Promise<void>;
    verifyEmail(token: string): Promise<void>;
}
