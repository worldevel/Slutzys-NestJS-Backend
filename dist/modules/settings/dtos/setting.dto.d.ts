import { ObjectId } from 'mongodb';
export declare class SettingDto {
    _id: ObjectId;
    key: string;
    value: any;
    name: string;
    description: string;
    group: string;
    public: boolean;
    type: string;
    visible: boolean;
    meta: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<SettingDto>);
    getValue(): any;
}
