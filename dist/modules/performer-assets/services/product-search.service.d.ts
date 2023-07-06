import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { UserDto } from 'src/modules/user/dtos';
import { OrderService } from 'src/modules/payment/services';
import { CategoryService } from 'src/modules/category/services';
import { ProductModel } from '../models';
import { ProductDto } from '../dtos';
import { ProductSearchRequest } from '../payloads';
export declare class ProductSearchService {
    private readonly categoryService;
    private readonly performerService;
    private readonly orderService;
    private readonly productModel;
    private readonly fileService;
    constructor(categoryService: CategoryService, performerService: PerformerService, orderService: OrderService, productModel: Model<ProductModel>, fileService: FileService);
    adminSearch(req: ProductSearchRequest): Promise<PageableData<ProductDto>>;
    performerSearch(req: ProductSearchRequest, user: UserDto): Promise<PageableData<ProductDto>>;
    userSearch(req: ProductSearchRequest, user: UserDto): Promise<PageableData<ProductDto>>;
}
