import { DataResponse, PageableData } from 'src/kernel';
import { UserService, UserSearchService } from '../services';
import { UserDto, IUserResponse } from '../dtos';
import { UserUpdatePayload, UserSearchRequestPayload } from '../payloads';
export declare class UserController {
    private readonly userService;
    private readonly userSearchService;
    constructor(userService: UserService, userSearchService: UserSearchService);
    me(req: any): Promise<DataResponse<IUserResponse>>;
    updateMe(currentUser: UserDto, payload: UserUpdatePayload): Promise<DataResponse<IUserResponse>>;
    search(req: UserSearchRequestPayload): Promise<DataResponse<PageableData<IUserResponse>>>;
}
