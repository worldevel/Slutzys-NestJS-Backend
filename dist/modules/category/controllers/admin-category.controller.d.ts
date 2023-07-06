import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { CategoryService } from '../services';
import { CategoryUpdatePayload } from '../payloads/category-update.payload';
import { CategoryCreatePayload } from '../payloads/category-create.payload';
import { CategorySearchRequest } from '../payloads/category-search.request';
export declare class AdminCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    createProductCategory(payload: CategoryCreatePayload, creator: UserDto): Promise<any>;
    updateGallery(id: string, payload: CategoryUpdatePayload, creator: UserDto): Promise<any>;
    searchCategory(req: CategorySearchRequest): Promise<any>;
    view(id: string): Promise<any>;
    delete(id: string): Promise<DataResponse<boolean>>;
}
