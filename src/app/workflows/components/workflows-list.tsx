import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../shared/redux';
import { loadWorkflowsList } from '../actions';
import { State } from '../state';

export interface WorkflowsListState {
    workflows?: any[];
}

class Component extends React.Component<{ workflows: any[], onLoad: any}> {

    public componentWillMount() {
        this.props.onLoad();
    }

    public render() {
        if (!this.props.workflows) {
            return <div>Loading...</div>;
        } else {
            return (
            <div>
                {this.props.workflows.map((workflow) =>
                    <div key={workflow.metadata.name}>
                        {workflow.metadata.name}
                    </div>,
                )}
            </div>
            );
        }
    }
}

export const WorkflowsList = connect((state: AppState<State>) => {
    return {
        workflows: state.page.workflowsList.workflows,
    };
}, (dispatch) => ({
    onLoad: () => dispatch(loadWorkflowsList()),
}) )(Component);
