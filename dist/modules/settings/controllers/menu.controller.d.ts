import { DataResponse, PageableData } from 'src/kernel';
import { MenuService } from '../services';
import { MenuCreatePayload, MenuUpdatePayload, MenuSearchRequestPayload } from '../payloads';
import { MenuDto, IMenuResponse } from '../dtos';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    create(payload: MenuCreatePayload): Promise<DataResponse<MenuDto>>;
    update(id: string, payload: MenuUpdatePayload): Promise<DataResponse<MenuDto>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    search(req: MenuSearchRequestPayload): Promise<DataResponse<PageableData<IMenuResponse>>>;
    userSearch(req: MenuSearchRequestPayload): Promise<DataResponse<PageableData<IMenuResponse>>>;
    details(id: string): Promise<DataResponse<MenuDto>>;
}
