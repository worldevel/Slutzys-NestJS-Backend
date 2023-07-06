export declare class CCBillPaymentGateway {
    subscriptionSubAccountNumber: string;
    singlePurchaseSubAccountNumber: string;
    flexformId: string;
    salt?: string;
}
export declare class PaymentGatewaySettingPayload {
    performerId: string;
    key: string;
    status: string;
    value: CCBillPaymentGateway;
}
