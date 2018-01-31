import * as models from '../../../models';
import requests from './requests';

export class WorkflowsService {
    public all(): Promise<models.WorkflowList> {
        return requests.get('/workflows');
    }
}
