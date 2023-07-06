import { Connection } from 'mongoose';
export declare const REACT_MODEL_PROVIDER = "REACT_MODEL_PROVIDER";
export declare const reactionProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
