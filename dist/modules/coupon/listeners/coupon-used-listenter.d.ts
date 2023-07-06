import { QueueEventService, QueueEvent } from 'src/kernel';
import { CouponService } from '../services/coupon.service';
export declare class UpdateCouponUsesListener {
    private readonly queueEventService;
    private readonly couponService;
    constructor(queueEventService: QueueEventService, couponService: CouponService);
    handleUpdateCoupon(event: QueueEvent): Promise<void>;
}
