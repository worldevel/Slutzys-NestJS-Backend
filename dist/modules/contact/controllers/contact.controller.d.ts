import { DataResponse } from 'src/kernel';
import { ContactService } from '../services';
import { ContactPayload } from '../payloads/contact.payload';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    contact(payload: ContactPayload): Promise<DataResponse<any>>;
}
