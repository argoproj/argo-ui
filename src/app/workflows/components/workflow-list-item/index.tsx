import * as React from 'react';

import * as models from '../../../../models';

import { WorkflowSteps } from '../workflow-steps';

require('./workflow-list-item.scss');

export const WorkflowListItem = (props: { workflow: models.Workflow }) => (
    <div className='workflow-list-item'>
        <div className='workflow-list-item__top'>
            <div className='workflow-list-item__status'>
                <div className='workflow-list-item__status-icon'>
                    {/* <i className='fa' aria-hidden='true' axStatusIcon [status]='status'></i> */}
                </div>
                <div className='workflow-list-item__status-message'>
                    {props.workflow.metadata.creationTimestamp}
                </div>
            </div>
        </div>

        <div className='workflow-list-item__content'>
            <div className='row collapse'>
                <div className='columns medium-7'>
                    <div className='workflow-list-item__content-box'>
                        <WorkflowSteps workflow={props.workflow}/>
                    </div>
                </div>
                <div className='columns medium-5'>
                    <div className='workflow-list-item__content-details'>
                        <div className='workflow-list-item__content-details-row'>
                            <span>{props.workflow.metadata.name}</span>
                        </div>
                        <div className='workflow-list-item__content-details-row'>
                            <span>{props.workflow.metadata.creationTimestamp}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
