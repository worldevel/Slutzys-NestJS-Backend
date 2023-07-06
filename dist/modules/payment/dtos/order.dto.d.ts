import { ObjectId } from 'mongodb';
export declare class OrderDto {
    _id: ObjectId;
    buyerId: ObjectId;
    buyerSource: string;
    sellerId: ObjectId;
    sellerSource: string;
    type: string;
    details: any[];
    status: string;
    quantity: number;
    totalPrice: number;
    originalPrice: number;
    deliveryAddress: string;
    postalCode: string;
    phoneNumber: string;
    paymentGateway: string;
    couponInfo: any;
    seller: any;
    buyer: any;
    orderNumber: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Partial<OrderDto>);
}
