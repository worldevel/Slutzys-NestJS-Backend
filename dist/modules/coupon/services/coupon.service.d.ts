import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { OrderModel } from 'src/modules/payment/models';
import { CouponCreatePayload, CouponUpdatePayload } from '../payloads';
import { CouponDto } from '../dtos';
import { CouponModel } from '../models';
export declare class CouponService {
    private readonly couponModel;
    private readonly orderModel;
    constructor(couponModel: Model<CouponModel>, orderModel: Model<OrderModel>);
    findByIdOrCode(id: string | ObjectId): Promise<CouponDto>;
    checkExistingCode(code: string, id?: string | ObjectId): Promise<boolean>;
    create(payload: CouponCreatePayload): Promise<CouponDto>;
    update(id: string | ObjectId, payload: CouponUpdatePayload): Promise<CouponDto>;
    delete(id: string | ObjectId | CouponModel): Promise<boolean>;
    applyCoupon(code: string, userId: string | ObjectId): Promise<CouponDto>;
    checkUsedCoupon(code: string, userId: string | ObjectId): Promise<boolean>;
    updateNumberOfUses(couponId: string | ObjectId): Promise<void>;
}
