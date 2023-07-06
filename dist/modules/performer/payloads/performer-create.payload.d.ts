import { ObjectId } from 'mongodb';
export declare class PerformerCreatePayload {
    name: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    status: string;
    email: string;
    verifiedEmail: boolean;
    phone: string;
    phoneCode: string;
    avatarId: ObjectId;
    coverId: ObjectId;
    idVerificationId: ObjectId;
    documentVerificationId: ObjectId;
    gender: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;
    address: string;
    languages: string[];
    categoryIds: string[];
    height: string;
    weight: string;
    bio: string;
    eyes: string;
    sexualPreference: string;
    monthlyPrice: number;
    yearlyPrice: number;
}
export declare class PerformerRegisterPayload {
    name: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    status: string;
    email: string;
    phone: string;
    phoneCode: string;
    avatarId: ObjectId;
    idVerificationId: ObjectId;
    documentVerificationId: ObjectId;
    gender: string;
}
