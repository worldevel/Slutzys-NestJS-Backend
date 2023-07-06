interface PaymentGateway<T> {
    subscription(options: T): Promise<string>;
    singlePurchase(options: T): Promise<string>;
    cancelSubscription(options: T): Promise<boolean>;
}
export declare abstract class PaymentGatewayService<T> implements PaymentGateway<T> {
    private baseURL;
    private callbackURL;
    private redirectSuccessURL;
    private redirectCancelURL;
    getBaseURL(): string;
    setBaseURL(baseURL: string): void;
    encode(data: {
        type: string;
        id: string;
    }): string | null;
    decode(data: string): string[];
    abstract subscription(_options: T): Promise<string>;
    abstract singlePurchase(_options: T): Promise<string>;
    abstract cancelSubscription(_options: T): Promise<boolean>;
    createHash(algorithm: string, data: any, encoding: any): string;
    buildQueryString(query: Record<string, any>): string;
}
export {};
