export declare class UserCreatePayload {
    firstName: string;
    lastName: string;
    name: string;
    phone: string;
    email: string;
    username: string;
    gender: string;
    country: string;
    verifiedEmail: boolean;
    constructor(params: Partial<UserCreatePayload>);
}
