import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { ProductService } from '../services/product.service';
import { ProductCreatePayload, ProductSearchRequest, ProductUpdatePayload } from '../payloads';
import { ProductSearchService } from '../services/product-search.service';
export declare class PerformerProductController {
    private readonly productService;
    private readonly productSearchService;
    constructor(productService: ProductService, productSearchService: ProductSearchService);
    uploadImage(file: FileDto): Promise<any>;
    create(files: Record<string, any>, payload: ProductCreatePayload, creator: UserDto): Promise<any>;
    update(id: string, files: Record<string, any>, payload: ProductUpdatePayload, updater: UserDto): Promise<any>;
    delete(id: string): Promise<any>;
    search(req: ProductSearchRequest, user: UserDto): Promise<any>;
    details(id: string): Promise<any>;
}
