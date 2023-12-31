import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class OrderDetailsModel extends Document {
    orderId: ObjectId;
    orderNumber: string;
    buyerId: ObjectId;
    buyerSource: string;
    sellerId: ObjectId;
    sellerSource: string;
    productType: string;
    productId: ObjectId;
    name: string;
    description: string;
    unitPrice: number;
    quantity: number;
    originalPrice: number;
    totalPrice: number;
    status: string;
    deliveryStatus: string;
    deliveryAddress: string;
    postalCode: string;
    phoneNumber: string;
    paymentStatus: string;
    paymentGateway: string;
    payBy: string;
    couponInfo: any;
    shippingCode: string;
    extraInfo: any;
    createdAt: Date;
    updatedAt: Date;
}
