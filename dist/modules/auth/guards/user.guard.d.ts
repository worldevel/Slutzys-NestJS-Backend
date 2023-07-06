import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../services';
export declare class LoadUser implements CanActivate {
    private readonly authService;
    constructor(authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
