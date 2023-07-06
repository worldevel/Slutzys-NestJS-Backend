import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class OrderModel extends Document {
  // buyer information
  buyerId: ObjectId;

  buyerSource: string;

  orderNumber: string;

  type: string;

  status: string;

  quantity: number;

  totalPrice: number;

  originalPrice: number;

  deliveryAddress: string;

  paymentGateway: string;

  postalCode: string;

  phoneNumber: string;

  sellerId: ObjectId;

  sellerSource: string;

  couponInfo: any;

  createdAt: Date;

  updatedAt: Date;
}
