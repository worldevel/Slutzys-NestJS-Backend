import { UserService } from 'src/modules/user/services';
import { DataResponse } from 'src/kernel';
import { Response } from 'express';
import { UserRegisterPayload } from '../payloads';
import { AuthService } from '../services';
export declare class RegisterController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    userRegister(req: UserRegisterPayload): Promise<DataResponse<{
        message: string;
    }>>;
    verifyEmail(res: Response, token: string): Promise<void>;
}
