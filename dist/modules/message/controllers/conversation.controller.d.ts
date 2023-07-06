import { DataResponse } from 'src/kernel';
import { CountryService } from 'src/modules/utils/services';
import { ConversationDto } from '../dtos';
import { ConversationService } from '../services/conversation.service';
import { ConversationCreatePayload, ConversationSearchPayload } from '../payloads';
export declare class ConversationController {
    private readonly countryService;
    private readonly conversationService;
    constructor(countryService: CountryService, conversationService: ConversationService);
    getListOfCurrentUser(query: ConversationSearchPayload, req: any): Promise<DataResponse<ConversationDto[]>>;
    getDetails(conversationId: string): Promise<DataResponse<any>>;
    create(payload: ConversationCreatePayload, user: any): Promise<DataResponse<ConversationDto>>;
}
