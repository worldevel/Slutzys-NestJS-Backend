import { UserService } from 'src/modules/user/services';
import { DataResponse } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { LoginPayload } from '../payloads';
import { AuthService } from '../services';
export declare class LoginController {
    private readonly performerService;
    private readonly userService;
    private readonly authService;
    constructor(performerService: PerformerService, userService: UserService, authService: AuthService);
    login(req: LoginPayload): Promise<DataResponse<{
        token: string;
    }>>;
}
