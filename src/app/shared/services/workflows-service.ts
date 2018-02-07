import { Observable } from 'rxjs';

import * as models from '../../../models';
import requests from './requests';

export class WorkflowsService {

    public list(phases: string[]): Promise<models.WorkflowList> {
        return requests.get('/workflows').query({ phase: phases }).then((res) => res.body as models.WorkflowList);
    }

    public watch(): Observable<models.WatchEvent<models.Workflow>> {
        return requests.loadEventSource('/workflows/live').repeat().retry().map((data) => JSON.parse(data));
    }
}
