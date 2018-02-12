import { Observable } from 'rxjs';

import * as models from '../../../models';
import requests from './requests';

export class WorkflowsService {

    public get(namespace: string, name: string): Promise<models.Workflow> {
        return requests.get(`/workflows/${namespace}/${name}`).then((res) => res.body as models.Workflow);
    }

    public list(phases: string[]): Promise<models.WorkflowList> {
        return requests.get('/workflows').query({ phase: phases }).then((res) => res.body as models.WorkflowList);
    }

    public watch(workflow?: {namespace: string; name: string}): Observable<models.WatchEvent<models.Workflow>> {
        let url = '/workflows/live';
        if (workflow) {
            url = `${url}?namespace=${workflow.namespace}&name=${workflow.name}`;
        }
        return requests.loadEventSource(url).repeat().retry().map((data) => JSON.parse(data));
    }

    public getArtifactDownloadUrl(workflow: models.Workflow, nodeName: string, artifactName: string) {
        return `/api/workflows/${workflow.metadata.namespace}/${workflow.metadata.name}/artifacts/${nodeName}/${artifactName}`;
    }
}
