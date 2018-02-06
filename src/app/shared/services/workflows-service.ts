import * as models from '../../../models';
import requests from './requests';

export class WorkflowsService {
    public list(phases: string[]): Promise<models.WorkflowList> {
        return requests.get('/workflows').query({ phase: phases }).then((res) => res.body as models.WorkflowList);
    }
}
