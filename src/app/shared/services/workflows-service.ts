import { Observable } from 'rxjs';

import * as models from '../../../models';
import requests from './requests';

export class WorkflowsService {

    public get(namespace: string, name: string): Promise<models.Workflow> {
        return requests.get(`/workflows/${namespace}/${name}`).then((res) => res.body as models.Workflow).then(this.populateDefaultFields);
    }

    public list(phases: string[]): Promise<models.Workflow[]> {
        return requests.get('/workflows').query({ phase: phases }).then((res) => res.body as models.WorkflowList).then((list) => list.items.map(this.populateDefaultFields));
    }

    public watch(workflow?: {namespace: string; name: string}): Observable<models.WatchEvent<models.Workflow>> {
        let url = '/workflows/live';
        if (workflow) {
            url = `${url}?namespace=${workflow.namespace}&name=${workflow.name}`;
        }
        return requests.loadEventSource(url).repeat().retry().map((data) => JSON.parse(data) as models.WatchEvent<models.Workflow>).map((watchEvent) => {
            watchEvent.object = this.populateDefaultFields(watchEvent.object);
            return watchEvent;
        });
    }

    public getContainerLogs(workflow: models.Workflow, nodeId: string, container: string): Observable<string> {
        return requests.loadEventSource(`/logs/${workflow.metadata.namespace}/${nodeId}/${container}`).map((line) => {
            return line ? line + '\n' : line;
        });
    }

    public getArtifactDownloadUrl(workflow: models.Workflow, nodeName: string, artifactName: string) {
        return `/api/workflows/${workflow.metadata.namespace}/${workflow.metadata.name}/artifacts/${nodeName}/${artifactName}`;
    }

    private populateDefaultFields(workflow: models.Workflow): models.Workflow {
        workflow = {status: { nodes: {} }, ...workflow};
        workflow.status.nodes = workflow.status.nodes || {};
        return workflow;
    }
}
