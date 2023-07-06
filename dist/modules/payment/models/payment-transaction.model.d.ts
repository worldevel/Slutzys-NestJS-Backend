import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class PaymentProductModel {
    name?: string;
    description?: string;
    price?: number | string;
    productType?: string;
    productId?: ObjectId;
    quantity?: number;
}
export declare class PaymentTransactionModel extends Document {
    paymentGateway: string;
    orderId: ObjectId;
    source: string;
    sourceId: ObjectId;
    type: string;
    totalPrice: number;
    products: PaymentProductModel[];
    paymentResponseInfo?: any;
    paymentToken?: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}
