import * as moment from 'moment';
import * as React from 'react';

import * as models from '../../../../models';
import { Duration, Tabs } from '../../../shared/components';
import { services } from '../../../shared/services';

require('./workflow-node-info.scss');

function nodeDuration(node: models.NodeStatus) {
    const endTime = node.finishedAt ? moment(node.finishedAt) : moment();
    return endTime.diff(moment(node.startedAt)) / 1000;
}

interface Props { node: models.NodeStatus; workflow: models.Workflow; }

const AttributeRow = (attr: { title: string, value: string }) => (
    <div className='row white-box__details-row' key={attr.title}>
        <div className='columns small-3'>
            {attr.title}
        </div>
        <div className='columns small-9'>{attr.value}</div>
    </div>
);
const AttributeRows = (props: { attributes: { title: string, value: string }[] }) => (
    <div>
        {props.attributes.map((attr) => <AttributeRow key={attr.title} {...attr}/>)}
    </div>
);

export const WorkflowNodeSummary = (props: Props) => {
    const attributes = [
        {title: 'NAME', value: props.node.name},
        {title: 'START TIME', value: props.node.startedAt},
        {title: 'END TIME', value: props.node.finishedAt || '-'},
        {title: 'DURATION', value: <Duration durationMs={nodeDuration(props.node)}/> },
    ];
    return (
        <div className='white-box'>
            <div className='white-box__details'>
                {<AttributeRows attributes={attributes}/>}
            </div>
        </div>
    );
};

export const WorkflowNodeInputs = (props: { inputs: models.Inputs }) => {
    const parameters = (props.inputs.parameters || []).map((artifact) => ({
        title: artifact.name,
        value: artifact.value,
    }));
    const artifacts = (props.inputs.artifacts || []).map((artifact) => ({
        title: artifact.name,
        value: artifact.path,
    }));
    return (
        <div className='white-box'>
            <div className='white-box__details'>
                {parameters.length > 0 && [
                    <div className='row white-box__details-row' key='title'>
                        <h6>Parameters</h6>
                    </div>,
                    <AttributeRows key='attrs' attributes={parameters}/>,
                ]}
                {artifacts.length > 0 && [
                    <div className='row white-box__details-row' key='title'>
                        <h6>Artifacts</h6>
                    </div>,
                    <AttributeRows key='attrs' attributes={artifacts}/>,
                ]}
            </div>
        </div>
    );
};

export const WorkflowNodeContainer = (props: { container: models.Container }) => {
    const attributes = [
        {title: 'NAME', value: props.container.name || 'main'},
        {title: 'IMAGE', value: props.container.image},
        {title: 'COMMAND', value: (props.container.command || []).join(' ')},
        {title: 'ARGS', value: (props.container.args || []).join(' ')},
    ];
    return (
        <div className='white-box'>
            <div className='white-box__details'>
                {<AttributeRows attributes={attributes}/>}
            </div>
        </div>
    );
};

export const WorkflowNodeContainers = (props: Props) => {
    const template = props.workflow.spec.templates.find((item) => item.name === props.node.templateName);
    if (!template || !template.container) {
        return <p>Step does not have containers</p>;
    }
    return (
        <div>
            <WorkflowNodeContainer container={template.container} />
            {template.sidecars && template.sidecars.length > 0 && (
                <div>
                    <h6>SIDECARS:</h6>
                    {template.sidecars.map((sidecar) => (
                        <div className='row' key={sidecar.name}>
                            <div className='columns small-3'>
                                {sidecar.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const WorkflowNodeArtifacts = (props: Props) => {
    const artifacts = props.node.outputs && props.node.outputs.artifacts && props.node.outputs.artifacts.map((artifact) => Object.assign({}, artifact, {
        downloadUrl: services.workflows.getArtifactDownloadUrl(props.workflow, props.node.name, artifact.name),
        stepName: props.node.name,
        dateCreated: props.node.finishedAt,
        nodeName: props.node.name,
    })) || [];
    return (
        <div className='white-box'>
            {artifacts.length === 0 && (
                <div className='row'>
                    <div className='columns small-12 text-center'>No data to display</div>
                </div>
            )}
            {artifacts.map((artifact) => (
                <div className='row' key={artifact.path}>
                    <div className='columns small-1'>
                        <a href={artifact.downloadUrl}> <i className='icon argo-icon-artifact'/></a>
                    </div>
                    <div className='columns small-11'>
                        <span className='title'>{artifact.name}</span>
                        <div className='workflow-node-info__artifact-details'>
                            <span title={artifact.nodeName} className='muted'>{artifact.nodeName}</span>
                            <span title={artifact.path} className='muted'>{artifact.path}</span>
                            <span title={artifact.dateCreated} className='muted'>{artifact.dateCreated}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const WorkflowNodeInfo = (props: Props) => (
    <div className='workflow-node-info'>
        <Tabs navCenter={true} navTransparent={true} tabs={[{
            title: 'SUMMARY', key: 'summary', content: (
                <div>
                    <WorkflowNodeSummary {...props}/>
                    {props.node.inputs && <WorkflowNodeInputs inputs={props.node.inputs} />}
                </div>
            ),
        }, {
            title: 'CONTAINERS', key: 'containers', content: <WorkflowNodeContainers {...props}/>,
        }, {
            title: 'ARTIFACTS', key: 'artifacts', content: <WorkflowNodeArtifacts {...props} />,
        }]} />
    </div>
);
