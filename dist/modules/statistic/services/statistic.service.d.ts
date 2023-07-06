import { Model } from 'mongoose';
import { GalleryModel, PhotoModel, ProductModel, VideoModel } from '../../performer-assets/models';
import { UserModel } from '../../user/models';
import { PerformerModel } from '../../performer/models';
import { SubscriptionModel } from '../../subscription/models/subscription.model';
import { OrderDetailsModel } from '../../payment/models';
import { EarningModel } from '../../earning/models/earning.model';
export declare class StatisticService {
    private readonly galleryModel;
    private readonly photoModel;
    private readonly productModel;
    private readonly videoModel;
    private readonly userModel;
    private readonly performerModel;
    private readonly subscriptionModel;
    private readonly orderDetailModel;
    private readonly earningModel;
    constructor(galleryModel: Model<GalleryModel>, photoModel: Model<PhotoModel>, productModel: Model<ProductModel>, videoModel: Model<VideoModel>, userModel: Model<UserModel>, performerModel: Model<PerformerModel>, subscriptionModel: Model<SubscriptionModel>, orderDetailModel: Model<OrderDetailsModel>, earningModel: Model<EarningModel>);
    stats(): Promise<any>;
}
