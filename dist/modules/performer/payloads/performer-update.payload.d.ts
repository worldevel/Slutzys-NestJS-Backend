export declare class PerformerUpdatePayload {
    name: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    status: string;
    email: string;
    phone: string;
    phoneCode: string;
    avatarId: string;
    coverId?: string;
    idVerificationId: string;
    documentVerificationId: string;
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
    bankingInfomation?: any;
}
export declare class SelfUpdatePayload {
    name: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
    phoneCode: string;
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
    bankingInfomation?: any;
    activateWelcomeVideo?: boolean;
    idVerificationId: string;
    documentVerificationId: string;
}
