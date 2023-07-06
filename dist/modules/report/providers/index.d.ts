import { Connection } from 'mongoose';
export declare const REPORT_MODEL_PROVIDER = "REPORT_MODEL_PROVIDER";
export declare const reportProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
