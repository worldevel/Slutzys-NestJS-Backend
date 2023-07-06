import { AuthService } from 'src/modules/auth/services/auth.service';
import { DataResponse } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
export declare class VerificationController {
    private readonly userService;
    private readonly performerService;
    private readonly authService;
    constructor(userService: UserService, performerService: PerformerService, authService: AuthService);
    resendVerificationEmail(email: string): Promise<DataResponse<{
        success: boolean;
    }>>;
}
