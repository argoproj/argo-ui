import * as PropTypes from 'prop-types';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Subscription } from 'rxjs';

import * as models from '../../../../models';
import { Page, Tabs } from '../../../shared/components';
import { AppContext, AppState } from '../../../shared/redux';
import * as actions from '../../actions';
import { State } from '../../state';

import { WorkflowArtifacts } from '../workflow-artifacts/workflow-artifacts';
import { WorkflowDag } from '../workflow-dag/workflow-dag';

interface Props extends RouteComponentProps<{ name: string; namespace: string; }> {
    workflow: models.Workflow;
    onLoad: (namespace: string, name: string) => any;
    changesSubscription: Subscription;
    selectedTabKey: string;
}

class Component extends React.Component<Props, any> {

    public componentWillMount() {
        this.props.onLoad(this.props.match.params.namespace, this.props.match.params.name);
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.match.params.name !== nextProps.match.params.name || this.props.match.params.namespace !== nextProps.match.params.namespace) {
            this.
            props.onLoad(nextProps.match.params.namespace, nextProps.match.params.name);
        }
    }

    public componentWillUnmount() {
        if (this.props.changesSubscription) {
            this.props.changesSubscription.unsubscribe();
        }
    }

    public render() {
        const tabProps = { isOnlyContentScrollable: true, extraVerticalScrollPadding: 108 };
        return (
            <Page title={`${this.props.match.params.namespace}/${this.props.match.params.name}`}>
                <Tabs onTabSelected={(tab) => this.appContext.router.history.push(`${this.props.match.url}?tab=${tab}`)}
                        selectedTabKey={this.props.selectedTabKey} fixed={true} tabs={[
                    {...tabProps, key: 'summary', title: 'SUMMARY', content: this.renderSummaryTab() },
                    {...tabProps, key: 'workflow', title: 'WORKFLOW', content: this.renderWorkflowTab() },
                    {...tabProps, key: 'artifacts', title: 'ARTIFACTS', content: this.renderArtifactsTab() },
                ]}/>
            </Page>
        );
    }

    private renderSummaryTab() {
        if (!this.props.workflow) {
            return <div>Loading...</div>;
        }
        return (
            <div className='argo-container'>
                <div className='white-box'>
                    <div className='row'>
                        <div className='columns large-6'>
                            <h6>Workflow Details</h6>
                        </div>
                    </div>
                    <div className='white-box__details'>
                        <div className='row white-box__details-row'>
                            <div className='large-3 columns white-box__details-label'>
                                Status:
                            </div>
                            <div className='large-9 columns'>
                                {this.props.workflow.status.phase}
                            </div>
                        </div>
                        <div className='row white-box__details-row'>
                            <div className='large-3 columns white-box__details-label'>
                                Name:
                            </div>
                            <div className='large-9 columns columns--narrower-height'>
                                {this.props.workflow.metadata.name}
                            </div>
                        </div>
                        <div className='row white-box__details-row'>
                        <div className='large-3 columns white-box__details-label'>
                            Namespace:
                        </div>
                        <div className='large-9 columns columns--narrower-height'>
                            {this.props.workflow.metadata.namespace}
                        </div>
                    </div>
                        <div className='row white-box__details-row'>
                            <div className='large-3 columns white-box__details-label'>
                                Time:
                            </div>
                            <div className='large-9 columns'>
                                <span>Started</span> on {this.props.workflow.metadata.creationTimestamp}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderWorkflowTab() {
        if (!this.props.workflow) {
            return <div>Loading...</div>;
        }
        return (
            <WorkflowDag workflow={this.props.workflow} height='100%'/>
        );
    }

    private renderArtifactsTab() {
        if (!this.props.workflow) {
            return <div>Loading...</div>;
        }
        return <WorkflowArtifacts workflow={this.props.workflow}/>;
    }

    private get appContext(): AppContext {
        return this.context as AppContext;
    }
}

(Component as React.ComponentClass).contextTypes = {
    router: PropTypes.object,
};

export const WorkflowDetails = connect((state: AppState<State>) => ({
    workflow: state.page.workflow,
    changesSubscription: state.page.changesSubscription,
    selectedTabKey: new URLSearchParams(state.router.location.search).get('tab'),
}), (dispatch) => ({
    onLoad: (namespace: string, name: string) => dispatch(actions.loadWorkflow(namespace, name)),
}))(Component);
