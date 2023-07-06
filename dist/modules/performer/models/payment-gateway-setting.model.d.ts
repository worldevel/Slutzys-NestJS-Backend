import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class PaymentGatewaySettingModel extends Document {
    performerId: ObjectId;
    status: string;
    key: string;
    value: any;
}
