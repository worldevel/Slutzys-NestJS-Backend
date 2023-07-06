import { Connection } from 'mongoose';
export declare const POST_MODEL_PROVIDER = "POST_MODEL";
export declare const postProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
