import { Connection } from 'mongoose';
export declare const CATEGORY_PROVIDER = "CATEGORY_PROVIDER";
export declare const categoryProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
