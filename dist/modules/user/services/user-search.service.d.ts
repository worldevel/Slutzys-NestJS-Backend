import { Model } from 'mongoose';
import { PageableData } from 'src/kernel/common';
import { UserModel } from '../models';
import { IUserResponse } from '../dtos';
import { UserSearchRequestPayload } from '../payloads';
export declare class UserSearchService {
    private readonly userModel;
    constructor(userModel: Model<UserModel>);
    search(req: UserSearchRequestPayload): Promise<PageableData<IUserResponse>>;
    performerSearch(req: UserSearchRequestPayload): Promise<PageableData<IUserResponse>>;
    searchByKeyword(req: UserSearchRequestPayload): Promise<any>;
}
