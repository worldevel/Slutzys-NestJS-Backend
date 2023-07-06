import { ObjectId } from 'mongodb';
interface CCBillSubscription {
    salt: string;
    flexformId: string;
    subAccountNumber: string;
    price: number;
    transactionId: string | ObjectId;
    subscriptionType: string;
}
interface CCBillSinglePurchase {
    salt: string;
    flexformId: string;
    subAccountNumber: string;
    transactionId: string | ObjectId;
    price: number;
}
interface ICCBillCancelSubscription {
    subscriptionId: string;
    ccbillClientAccNo: string;
    ccbillDatalinkUsername: string;
    ccbillDatalinkPassword: string;
}
export declare class CCBillService {
    subscription(options: CCBillSubscription): {
        paymentUrl: string;
    };
    singlePurchase(options: CCBillSinglePurchase): {
        paymentUrl: string;
    };
    cancelSubscription(options: ICCBillCancelSubscription): Promise<any>;
}
export {};
