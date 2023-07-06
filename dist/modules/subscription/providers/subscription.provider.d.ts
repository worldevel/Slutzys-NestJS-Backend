import { Connection } from 'mongoose';
export declare const SUBSCRIPTION_MODEL_PROVIDER = "SUBSCRIPTION_MODEL_PROVIDER";
export declare const subscriptionProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
