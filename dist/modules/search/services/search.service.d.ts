import { Model } from 'mongoose';
import { GalleryModel, ProductModel, VideoModel } from 'src/modules/performer-assets/models';
import { PerformerBlockService } from 'src/modules/block/services';
import { PerformerModel } from '../../performer/models';
import { SearchPayload } from '../payloads';
export declare class SearchService {
    private readonly performerBlockService;
    private readonly galleryModel;
    private readonly productModel;
    private readonly videoModel;
    private readonly performerModel;
    constructor(performerBlockService: PerformerBlockService, galleryModel: Model<GalleryModel>, productModel: Model<ProductModel>, videoModel: Model<VideoModel>, performerModel: Model<PerformerModel>);
    countTotal(req: SearchPayload, countryCode: string): Promise<any>;
}
