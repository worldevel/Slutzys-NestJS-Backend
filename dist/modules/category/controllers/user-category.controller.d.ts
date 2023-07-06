import { CategoryService } from '../services';
import { CategorySearchRequest } from '../payloads/category-search.request';
export declare class UserCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getActiveProductCategories(req: CategorySearchRequest): Promise<any>;
}
