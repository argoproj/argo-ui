import deepEqual = require('deep-equal');
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { connect } from 'react-redux';

import * as models from '../../../../models';
import { MockupList, Page, TopBarFilter } from '../../../shared/components';
import { AppContext, AppState } from '../../../shared/redux';
import { loadWorkflowsList } from '../../actions';
import { State } from '../../state';

import { WorkflowListItem } from '../workflow-list-item/workflow-list-item';

interface Props {
    workflows: models.Workflow[];
    phases: string[];
    onPhasesChanged: (phases: string[]) => any;
}

class Component extends React.Component<Props, any> {

    public componentWillMount() {
        this.props.onPhasesChanged(this.props.phases);
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (!deepEqual(this.props.phases, nextProps.phases)) {
            this.props.onPhasesChanged(nextProps.phases);
        }
    }

    public render() {
        const statusFilter: TopBarFilter<string> = {
            items: Object.keys(models.NODE_PHASE).map((phase) => ({
                value: models.NODE_PHASE[phase],
                label: models.NODE_PHASE[phase],
            })),
            selectedValues: this.props.phases,
            selectionChanged: (phases) => {
                const query = phases.length > 0 ? '?' + phases.map((phase) => `phase=${phase}`).join('&') : '';
                this.appContext.router.history.push(`/workflows${query}`);
            },
        };
        return (
            <Page title='Workflows' filter={statusFilter}>
                <div className='argo-container'>
                    <div className='stream'>
                        {this.props.workflows ? this.props.workflows.map((workflow) => (
                            <div key={workflow.metadata.name} onClick={() => this.appContext.router.history.push(`/workflows/${workflow.metadata.name}`)}>
                                <WorkflowListItem workflow={workflow}/>
                            </div>
                        )) :
                        <MockupList height={150} marginTop={30}/>}
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
        phases: new URLSearchParams(state.router.location.search).getAll('phase'),
    };
}, (dispatch) => ({
    onPhasesChanged: (phases: string[]) => dispatch(loadWorkflowsList(phases)),
}))(Component);
