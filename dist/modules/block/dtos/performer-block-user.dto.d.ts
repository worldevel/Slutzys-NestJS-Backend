import { ObjectId } from 'mongodb';
export declare class PerformerBlockUserDto {
    _id: ObjectId;
    source: string;
    sourceId: ObjectId;
    target: string;
    targetId: ObjectId;
    reason: string;
    targetInfo?: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PerformerBlockUserDto>);
}
