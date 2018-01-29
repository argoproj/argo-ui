import requests from './requests';

export class WorkflowsService {
    public all(): Promise<any> {
        return requests.get('/workflows');
    }
}
