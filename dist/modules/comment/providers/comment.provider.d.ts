import { Connection } from 'mongoose';
export declare const COMMENT_MODEL_PROVIDER = "COMMENT_MODEL_PROVIDER";
export declare const commentProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
