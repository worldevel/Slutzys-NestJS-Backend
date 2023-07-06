import { ObjectId } from 'mongodb';
export interface ICouponResponse {
    _id?: ObjectId;
    name?: string;
    description?: string;
    code?: string;
    value?: number;
    numberOfUses?: number;
    expiredDate?: string | Date;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class CouponDto {
    _id?: ObjectId;
    name?: string;
    description?: string;
    code?: string;
    value?: number;
    numberOfUses?: number;
    expiredDate?: string | Date;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<CouponDto>);
    toResponse(includePrivateInfo?: boolean): {
        _id: ObjectId;
        code: string;
        value: number;
    };
}
