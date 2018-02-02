import * as PropTypes from 'prop-types';
import * as React from 'react';
import { connect } from 'react-redux';

import * as models from '../../../../models';
import { Page } from '../../../shared/components';
import { AppContext, AppState } from '../../../shared/redux';
import { loadWorkflowsList } from '../../actions';
import { State } from '../../state';

import { WorkflowListItem } from '../workflow-list-item/workflow-list-item';

class Component extends React.Component<{ workflows: models.Workflow[], onLoad: () => any}, any> {

    public componentWillMount() {
        this.props.onLoad();
    }

    public render() {
        return (
            <Page title='Workflows'>
                <div className='argo-container'>
                    <div className='stream'>
                        {(this.props.workflows || []).map((workflow) => (
                            <div key={workflow.metadata.name} onClick={() => this.appContext.router.history.push(`/workflows/${workflow.metadata.name}`)}>
                                <WorkflowListItem workflow={workflow}/>
                            </div>
                        ))}
                    </div>
                </div>
            </Page>
        );
    }

    private get appContext(): AppContext {
        return this.context as AppContext;
    }
}

(Component as React.ComponentClass).contextTypes = {
    router: PropTypes.object,
};

export const WorkflowsList = connect((state: AppState<State>) => {
    return {
        workflows: state.page.workflows,
    };
}, (dispatch) => ({
    onLoad: () => dispatch(loadWorkflowsList()),
}))(Component);
