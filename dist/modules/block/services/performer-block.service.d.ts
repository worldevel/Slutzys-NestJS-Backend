import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserDto } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import { PerformerBlockUserDto } from '../dtos';
import { PerformerBlockCountryModel, PerformerBlockUserModel } from '../models';
import { PerformerBlockCountriesPayload, PerformerBlockUserPayload, GetBlockListUserPayload } from '../payloads';
export declare class PerformerBlockService {
    private readonly userService;
    private readonly performerBlockCountryModel;
    private readonly blockedByPerformerModel;
    private readonly mailService;
    constructor(userService: UserService, performerBlockCountryModel: Model<PerformerBlockCountryModel>, blockedByPerformerModel: Model<PerformerBlockUserModel>, mailService: MailerService);
    findBlockCountriesByQuery(query: any): import("mongoose").Query<PerformerBlockCountryModel[], PerformerBlockCountryModel>;
    findOneBlockCountriesByQuery(query: any): import("mongoose").Query<PerformerBlockCountryModel, PerformerBlockCountryModel>;
    listByQuery(query: any): import("mongoose").Query<PerformerBlockUserModel[], PerformerBlockUserModel>;
    checkBlockedCountryByIp(performerId: string | ObjectId, countryCode: string): Promise<boolean>;
    checkBlockedByPerformer(performerId: string | ObjectId, userId: string | ObjectId): Promise<boolean>;
    performerBlockCountries(payload: PerformerBlockCountriesPayload, user: UserDto): Promise<any>;
    blockUser(user: UserDto, payload: PerformerBlockUserPayload): Promise<PerformerBlockUserModel>;
    unblockUser(user: UserDto, targetId: string): Promise<{
        unlocked: boolean;
    }>;
    getBlockedUsers(user: UserDto, req: GetBlockListUserPayload): Promise<{
        data: PerformerBlockUserDto[];
        total: number;
    }>;
}
