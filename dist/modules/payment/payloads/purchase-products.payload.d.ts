export declare class PurchaseProductsPayload {
    products: [
        {
            quantity: number;
            _id: string;
        }
    ];
    couponCode: string;
    deliveryAddress: string;
    postalCode: string;
    phoneNumber: string;
    paymentGateway: string;
}
