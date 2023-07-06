import { DataResponse } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { ProductService } from '../services/product.service';
import { ProductSearchService } from '../services/product-search.service';
import { ProductSearchRequest } from '../payloads';
export declare class UserProductsController {
    private readonly authService;
    private readonly productService;
    private readonly productSearchService;
    constructor(authService: AuthService, productService: ProductService, productSearchService: ProductSearchService);
    search(req: ProductSearchRequest, user: UserDto): Promise<DataResponse<{
        total: number;
        data: {
            _id: import("bson").ObjectId;
            performerId: import("bson").ObjectId;
            digitalFileId: import("bson").ObjectId;
            digitalFile: any;
            imageIds: import("bson").ObjectId[];
            images: any;
            categoryIds: import("bson").ObjectId[];
            categories: any;
            type: string;
            name: string;
            slug: string;
            description: string;
            status: string;
            price: number;
            stock: number;
            performer: any;
            createdBy: import("bson").ObjectId;
            updatedBy: import("bson").ObjectId;
            createdAt: Date;
            updatedAt: Date;
            stats: {
                likes: number;
                comments: number;
                views: number;
            };
            isBought: boolean;
        }[];
    }>>;
    details(id: string): Promise<DataResponse<{
        _id: import("bson").ObjectId;
        performerId: import("bson").ObjectId;
        digitalFileId: import("bson").ObjectId;
        digitalFile: any;
        imageIds: import("bson").ObjectId[];
        images: any;
        categoryIds: import("bson").ObjectId[];
        categories: any;
        type: string;
        name: string;
        slug: string;
        description: string;
        status: string;
        price: number;
        stock: number;
        performer: any;
        createdBy: import("bson").ObjectId;
        updatedBy: import("bson").ObjectId;
        createdAt: Date;
        updatedAt: Date;
        stats: {
            likes: number;
            comments: number;
            views: number;
        };
        isBought: boolean;
    }>>;
    getDownloadLink(id: string, user: UserDto): Promise<DataResponse<{
        downloadLink: string;
    }>>;
    checkAuth(request: any): Promise<DataResponse<boolean>>;
}
