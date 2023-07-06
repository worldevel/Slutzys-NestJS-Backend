import { QueueService, SearchRequest } from 'src/kernel';
import { SettingService } from 'src/modules/settings';
import { Model } from 'mongoose';
import { IMail } from '../interfaces';
import { EmailTemplateUpdatePayload } from '../payloads/email-template-update.payload';
import { EmailTemplateModel } from '../models/email-template.model';
export declare class MailerService {
    private readonly queueService;
    private readonly settingService;
    private readonly EmailTemplate;
    private mailerQueue;
    constructor(queueService: QueueService, settingService: SettingService, EmailTemplate: Model<EmailTemplateModel>);
    private init;
    private getTransport;
    private getTemplate;
    private process;
    send(email: IMail): Promise<void>;
    verify(): Promise<any>;
    getAllTemplates(req: SearchRequest): Promise<Pick<Pick<import("mongoose")._LeanDocument<EmailTemplateModel>, "updatedAt" | "_id" | "name" | "description" | "createdAt" | "__v" | "id" | "key" | "value" | "subject" | "content" | "layout">, "updatedAt" | "_id" | "name" | "description" | "createdAt" | "__v" | "id" | "key" | "value" | "subject" | "content" | "layout">[]>;
    findOne(id: string): Promise<EmailTemplateModel>;
    updateTemplate(id: string, payload: EmailTemplateUpdatePayload): Promise<EmailTemplateModel>;
}
