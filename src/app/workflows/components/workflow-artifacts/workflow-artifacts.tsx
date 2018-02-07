import * as React from 'react';

import * as models from '../../../../models';

interface Props {
    workflow: models.Workflow;
}

export const WorkflowArtifacts = (props: Props) => {
    const workflowStatusNodes = props.workflow.status && props.workflow.status.nodes || {};
    const artifacts = Object.keys(workflowStatusNodes)
        .map((nodeName) => {
            const node = workflowStatusNodes[nodeName];
            const nodeOutputs = (node.outputs || { artifacts: [] as models.Artifact[] });
            const items = nodeOutputs.artifacts || [];
            return items.map((item) => Object.assign({}, item, {
                downloadUrl: `/api/workflows/${props.workflow.metadata.namespace}/${props.workflow.metadata.name}/artifacts/${nodeName}/${item.name}`,
                stepName: node.name,
                dateCreated: node.finishedAt,
                nodeName,
            }));
        })
        .reduce((first, second) => first.concat(second), []) || [];
    if (artifacts.length === 0) {
        return (
            <div className='row'>
                <div className='columns small-12 text-center'>No data to display</div>
            </div>
        );
    }
    return (
        <div className='argo-container'>
            <div className='argo-table-list argo-table-list--clickable'>
                <div className='argo-table-list__head'>
                    <div className='row'>
                        <div className='columns small-3'> NAME </div>
                        <div className='columns small-3'> STEP NAME </div>
                        <div className='columns small-3'> PATH </div>
                        <div className='columns small-3'> DATE CREATED </div>
                    </div>
                </div>
                {artifacts.map((artifact) => (
                    <div className='argo-table-list__row' key={artifact.path}>
                        <div className='row'>
                            <div className='columns small-3'>
                                <span>
                                    <a href={artifact.downloadUrl}>
                                        <i className='fa fa-download' aria-hidden='true'/> {artifact.name}
                                    </a>
                                </span>
                            </div>
                            <div className='columns small-3'>{artifact.stepName}</div>
                            <div className='columns small-3'>{artifact.path}</div>
                            <div className='columns small-3'>{artifact.dateCreated}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
