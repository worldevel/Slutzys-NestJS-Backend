import { UserCreatePayload } from './user-create.payload';
export declare class UserAuthCreatePayload extends UserCreatePayload {
    email: string;
    password: string;
    roles: string[];
    status: string;
    balance: number;
    constructor(params: Partial<UserAuthCreatePayload>);
}
