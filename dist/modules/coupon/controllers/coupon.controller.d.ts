import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { CouponService, CouponSearchService } from '../services';
import { CouponCreatePayload, CouponUpdatePayload, CouponSearchRequestPayload } from '../payloads';
import { CouponDto, ICouponResponse } from '../dtos';
export declare class AdminCouponController {
    private readonly couponService;
    private readonly couponSearchService;
    constructor(couponService: CouponService, couponSearchService: CouponSearchService);
    create(payload: CouponCreatePayload): Promise<DataResponse<CouponDto>>;
    update(id: string, currentUser: UserDto, payload: CouponUpdatePayload): Promise<DataResponse<CouponDto>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    search(req: CouponSearchRequestPayload): Promise<DataResponse<PageableData<ICouponResponse>>>;
    details(id: string): Promise<DataResponse<CouponDto>>;
    checkApplyCoupon(code: string, currentUser: UserDto): Promise<DataResponse<ICouponResponse>>;
}
