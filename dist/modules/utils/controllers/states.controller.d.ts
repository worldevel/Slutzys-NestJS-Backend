import { DataResponse } from 'src/kernel';
import { StateService } from '../services/state.service';
export declare class StateController {
    private readonly stateService;
    constructor(stateService: StateService);
    list(code: string): DataResponse<any>;
}
