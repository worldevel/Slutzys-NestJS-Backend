import { Connection } from 'mongoose';
export declare const PERFORMER_MODEL_PROVIDER = "PERFORMER_MODEL";
export declare const PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER = "PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER";
export declare const PERFORMER_COMMISSION_SETTING_MODEL_PROVIDER = "PERFORMER_COMMISSION_SETTING_MODEL_PROVIDER";
export declare const PERFORMER_BANKING_SETTING_MODEL_PROVIDER = "PERFORMER_BANKING_SETTING_MODEL_PROVIDER";
export declare const performerProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
