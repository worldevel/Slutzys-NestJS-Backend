import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PageableData } from 'src/kernel';
import { MenuModel } from '../models';
import { MenuDto } from '../dtos';
import { MenuCreatePayload, MenuSearchRequestPayload, MenuUpdatePayload } from '../payloads';
export declare class MenuService {
    private readonly menuModel;
    constructor(menuModel: Model<MenuModel>);
    findById(id: string | ObjectId): Promise<MenuModel>;
    create(payload: MenuCreatePayload): Promise<MenuDto>;
    update(id: string | ObjectId, payload: MenuUpdatePayload): Promise<MenuDto>;
    delete(id: string | ObjectId | MenuModel): Promise<boolean>;
    search(req: MenuSearchRequestPayload): Promise<PageableData<MenuDto>>;
    userSearch(req: MenuSearchRequestPayload): Promise<PageableData<MenuDto>>;
    getPublicMenus(): Promise<MenuModel[]>;
}
