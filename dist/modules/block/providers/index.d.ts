import { Connection } from 'mongoose';
export declare const PERFORMER_BLOCK_COUNTRY_PROVIDER = "PERFORMER_BLOCK_COUNTRY_PROVIDER";
export declare const PERFORMER_BLOCK_USER_PROVIDER = "PERFORMER_BLOCK_USER_PROVIDER";
export declare const SITE_BLOCK_COUNTRY_PROVIDER = "SITE_BLOCK_COUNTRY_PROVIDER";
export declare const blockProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
