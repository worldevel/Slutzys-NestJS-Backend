import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { CouponModel } from '../models';
import { CouponSearchRequestPayload } from '../payloads';
import { CouponDto } from '../dtos';
export declare class CouponSearchService {
    private readonly couponModel;
    constructor(couponModel: Model<CouponModel>);
    search(req: CouponSearchRequestPayload): Promise<PageableData<CouponDto>>;
}
