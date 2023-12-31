import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService } from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import { AuthService } from 'src/modules/auth/services';
import { CheckPaymentService } from 'src/modules/payment/services';
import { CategoryService } from 'src/modules/category/services';
import { ProductDto } from '../dtos';
import { ProductCreatePayload, ProductUpdatePayload } from '../payloads';
import { ProductModel } from '../models';
export declare const PERFORMER_COUNT_PRODUCT_CHANNEL = "PERFORMER_COUNT_PRODUCT_CHANNEL";
export declare class ProductService {
    private readonly categoryService;
    private readonly authService;
    private readonly performerService;
    private readonly checkPaymentService;
    private readonly productModel;
    private readonly fileService;
    private readonly queueEventService;
    constructor(categoryService: CategoryService, authService: AuthService, performerService: PerformerService, checkPaymentService: CheckPaymentService, productModel: Model<ProductModel>, fileService: FileService, queueEventService: QueueEventService);
    findByIds(ids: any): Promise<ProductDto[]>;
    findById(id: string | ObjectId): Promise<ProductModel>;
    validatePhoto(photo: FileDto): Promise<any>;
    create(payload: ProductCreatePayload, digitalFile: FileDto, creator?: UserDto): Promise<ProductDto>;
    update(id: string | ObjectId, payload: ProductUpdatePayload, digitalFile: FileDto, updater?: UserDto): Promise<ProductDto>;
    delete(id: string | ObjectId): Promise<boolean>;
    getDetails(id: string): Promise<ProductDto>;
    userGetDetails(id: string): Promise<ProductDto>;
    updateStock(id: string | ObjectId, num?: number): Promise<any>;
    updateCommentStats(id: string | ObjectId, num?: number): Promise<any>;
    updateLikeStats(id: string | ObjectId, num?: number): Promise<any>;
    generateDownloadLink(productId: any, userId: any): Promise<string>;
    checkAuth(req: any, user: UserDto): Promise<boolean>;
}
