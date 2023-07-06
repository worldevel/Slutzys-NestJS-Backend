import { Response } from 'express';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import { DataResponse } from 'src/kernel';
import { AuthService } from '../services';
import { PasswordChangePayload, PasswordAdminChangePayload, ForgotPayload } from '../payloads';
export declare class PasswordController {
    private readonly userService;
    private readonly authService;
    private readonly performerService;
    constructor(userService: UserService, authService: AuthService, performerService: PerformerService);
    updatePassword(user: UserDto, payload: PasswordChangePayload): Promise<DataResponse<boolean>>;
    updateUserPassword(user: UserDto, payload: PasswordAdminChangePayload): Promise<DataResponse<boolean>>;
    forgotPassword(req: ForgotPayload): Promise<DataResponse<{
        success: boolean;
    }>>;
    renderUpdatePassword(res: Response, token: string): Promise<void>;
    updatePasswordForm(res: Response, token: string, password: string): Promise<void>;
}
