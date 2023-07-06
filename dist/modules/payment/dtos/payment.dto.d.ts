import { ObjectId } from 'mongodb';
import { ICouponResponse } from 'src/modules/coupon/dtos';
export interface PaymentProduct {
    name?: string;
    description?: string;
    price?: number | string;
    extraInfo?: any;
    productType?: string;
    productId?: ObjectId;
    performerId?: ObjectId;
    quantity?: number;
}
export interface DigitalProductResponse {
    digitalFileUrl?: any;
    digitalFileId?: any;
    _id?: string | ObjectId;
}
export declare class IPaymentResponse {
    _id: ObjectId;
    paymentGateway?: string;
    sourceInfo?: any;
    source?: string;
    sourceId: ObjectId;
    performerId?: ObjectId;
    performerInfo?: any;
    target?: string;
    targetId?: ObjectId;
    type?: string;
    products?: PaymentProduct[];
    paymentResponseInfo?: any;
    totalPrice?: number;
    originalPrice?: number;
    couponInfo?: ICouponResponse;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
    digitalProducts?: DigitalProductResponse[];
    deliveryAddress?: string;
}
export declare class PaymentDto {
    _id: ObjectId;
    orderId?: ObjectId;
    paymentGateway?: string;
    sourceInfo?: any;
    source?: string;
    sourceId: ObjectId;
    performerId?: ObjectId;
    performerInfo?: any;
    target?: string;
    targetId?: ObjectId;
    type?: string;
    products?: PaymentProduct[];
    paymentResponseInfo?: any;
    totalPrice?: number;
    originalPrice?: number;
    couponInfo?: ICouponResponse;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
    digitalProducts?: DigitalProductResponse[];
    deliveryAddress?: string;
    constructor(data?: Partial<PaymentDto>);
    toResponse(includePrivateInfo?: boolean): IPaymentResponse;
}
