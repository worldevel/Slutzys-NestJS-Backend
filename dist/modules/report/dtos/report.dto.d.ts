import { ObjectId } from 'mongodb';
export declare class ReportDto {
    _id?: ObjectId;
    title: string;
    description: string;
    source: string;
    sourceId: ObjectId;
    sourceInfo?: any;
    performerId: ObjectId;
    performerInfo?: any;
    target: string;
    targetId: ObjectId;
    targetInfo?: any;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<ReportDto>);
}
