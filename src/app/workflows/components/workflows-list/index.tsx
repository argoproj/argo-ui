import * as React from 'react';
import { connect } from 'react-redux';

import * as models from '../../../../models';
import { AppState } from '../../../shared/redux';
import { loadWorkflowsList } from '../../actions';
import { State } from '../../state';

import { WorkflowListItem } from '../workflow-list-item';

export interface WorkflowsListState {
    workflows?: models.Workflow[];
}

class Component extends React.Component<{ workflows: models.Workflow[], onLoad: () => any}> {

    public componentWillMount() {
        this.props.onLoad();
    }

    public render() {
        if (!this.props.workflows) {
            return <div>Loading...</div>;
        }
        return (
            <div className='content content--without-padding-bottom content--with-padding-top'>
                <div className='argo-container'>
                    <div className='stream'>
                        {this.props.workflows.map((workflow) => (
                            <WorkflowListItem key={workflow.metadata.name} workflow={workflow}/>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export const WorkflowsList = connect((state: AppState<State>) => {
    return {
        workflows: state.page.workflowsList.workflows,
    };
}, (dispatch) => ({
    onLoad: () => dispatch(loadWorkflowsList()),
}))(Component);
