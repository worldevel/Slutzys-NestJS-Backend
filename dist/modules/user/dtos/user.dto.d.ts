import { ObjectId } from 'mongodb';
export interface IUserResponse {
    _id?: ObjectId;
    name?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    roles?: string[];
    avatar?: string;
    status?: string;
    gender?: string;
    country?: string;
    verifiedEmail?: boolean;
    isOnline?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class UserDto {
    _id: ObjectId;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    roles: string[];
    avatarId?: string | ObjectId;
    avatarPath?: string;
    avatar?: string;
    status?: string;
    username?: string;
    gender?: string;
    country?: string;
    verifiedEmail?: boolean;
    isOnline?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<UserDto>);
    getName(): string;
    toResponse(includePrivateInfo?: boolean, isAdmin?: boolean): IUserResponse;
}
