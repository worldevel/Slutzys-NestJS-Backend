export declare class PasswordChangePayload {
    source: string;
    type: string;
    password: string;
}
export declare class PasswordUserChangePayload {
    type: string;
    source: string;
    userId: string;
    password: string;
}
export declare class PasswordAdminChangePayload {
    source: string;
    userId: string;
    password: string;
}
