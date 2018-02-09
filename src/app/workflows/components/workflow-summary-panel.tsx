import * as React from 'react';

import { Workflow } from '../../../models';

export const WorkflowSummaryPanel = (props: { workflow: Workflow }) => {
    const attributes = [
        {title: 'Status', value: props.workflow.status.phase},
        {title: 'Name', value: props.workflow.metadata.name},
        {title: 'Namespace', value: props.workflow.metadata.namespace},
        {title: 'Time', value: props.workflow.metadata.creationTimestamp},
    ];
    return (
        <div className='white-box'>
            <div className='white-box__details'>
                {attributes.map((attr) => (
                    <div className='row white-box__details-row' key={attr.title}>
                        <div className='columns small-3'>
                            {attr.title}
                        </div>
                        <div className='columns small-9'>{attr.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
