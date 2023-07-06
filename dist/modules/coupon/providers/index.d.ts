import { Connection } from 'mongoose';
export declare const COUPON_PROVIDER = "COUPON_PROVIDER";
export declare const couponProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
