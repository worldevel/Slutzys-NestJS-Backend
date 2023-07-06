export declare const PAYMENT_STATUS: {
    PENDING: string;
    SUCCESS: string;
    CANCELLED: string;
};
export declare enum PAYMENT_GATEWAY {
    CCBILL = "ccbill"
}
export declare const PAYMENT_TYPE: {
    MONTHLY_SUBSCRIPTION: string;
    YEARLY_SUBSCRIPTION: string;
    SALE_VIDEO: string;
    PRODUCT: string;
    PERFORMER_PRODUCT: string;
};
export declare const PAYMENT_TARTGET_TYPE: {
    PERFORMER: string;
    PRODUCT: string;
    VIDEO: string;
    PERFORMER_PRODUCT: string;
};
export declare const TRANSACTION_SUCCESS_CHANNEL = "TRANSACTION_SUCCESS_CHANNEL";
export declare const ORDER_PAID_SUCCESS_CHANNEL = "ORDER_PAID_SUCCESS_CHANNEL";
export declare const OVER_PRODUCT_STOCK = "OVER_PRODUCT_STOCK";
export declare const DIFFERENT_PERFORMER_PRODUCT = "DIFFERENT_PERFORMER_PRODUCT";
export declare const MISSING_CONFIG_PAYMENT_GATEWAY = "Payment has not configured for this model yet";
export declare const ORDER_STATUS: {
    PROCESSING: string;
    SHIPPING: string;
    DELIVERED: string;
    REFUNDED: string;
    PENDING: string;
    CREATED: string;
    PAID: string;
};
export declare const DELIVERY_STATUS: {
    PROCESSING: string;
    SHIPPING: string;
    DELIVERED: string;
    CREATED: string;
    REFUNDED: string;
};
export declare const PRODUCT_TYPE: {
    MONTHLY_SUBSCRIPTION: string;
    YEARLY_SUBSCRIPTION: string;
    SALE_VIDEO: string;
    PERFORMER_PRODUCT: string;
    DIGITAL_PRODUCT: string;
    PHYSICAL_PRODUCT: string;
};
