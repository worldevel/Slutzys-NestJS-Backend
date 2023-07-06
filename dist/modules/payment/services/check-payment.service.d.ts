import { UserDto } from 'src/modules/user/dtos';
import { Model } from 'mongoose';
import { GalleryDto, ProductDto, VideoDto } from 'src/modules/performer-assets/dtos';
import { OrderDetailsModel } from '../models';
export declare class CheckPaymentService {
    private readonly orderDetailsModel;
    constructor(orderDetailsModel: Model<OrderDetailsModel>);
    checkBoughtVideo: (video: VideoDto, user: UserDto) => Promise<number>;
    checkBoughtProduct(product: ProductDto, user: UserDto): Promise<number>;
    checkBoughtGallery(gallery: GalleryDto, user: UserDto): Promise<number>;
}
