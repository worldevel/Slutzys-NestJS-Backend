import { Connection } from 'mongoose';
export declare const PAYMENT_TRANSACTION_MODEL_PROVIDER = "PAYMENT_TRANSACTION_MODEL_PROVIDER";
export declare const paymentProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
export declare const ORDER_MODEL_PROVIDER = "ORDER_MODEL_PROVIDER";
export declare const ORDER_DETAIL_MODEL_PROVIDER = "ORDER_DETAIL_MODEL_PROVIDER";
export declare const orderProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
