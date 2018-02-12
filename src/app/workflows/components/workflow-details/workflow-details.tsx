import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Subscription } from 'rxjs';

import * as models from '../../../../models';
import { Page } from '../../../shared/components';
import { AppContext, AppState } from '../../../shared/redux';
import * as actions from '../../actions';
import { State } from '../../state';

import { WorkflowArtifacts } from '../workflow-artifacts';
import { WorkflowDag } from '../workflow-dag/workflow-dag';
import { WorkflowNodeInfo } from '../workflow-node-info/workflow-node-info';
import { WorkflowSummaryPanel } from '../workflow-summary-panel';

interface Props extends RouteComponentProps<{ name: string; namespace: string; }> {
    workflow: models.Workflow;
    onLoad: (namespace: string, name: string) => any;
    changesSubscription: Subscription;
    selectedTabKey: string;
    selectedNodeId: string;
}

require('./workflow-details.scss');

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
        const selectedNode = this.props.workflow && this.props.workflow.status && this.props.workflow.status.nodes[this.props.selectedNodeId];
        return (
            <Page title={'Workflow Details'} toolbar={{
                    breadcrumbs: [{title: 'Workflows', path: '/workflows' }, { title: this.props.match.params.name }],
                    tools: (
                        <div className='workflow-details__topbar-buttons'>
                            <a className={classNames({ active: this.props.selectedTabKey === 'summary' })} onClick={() => this.selectTab('summary')}>
                                <i className='fa fa-columns'/>
                            </a>
                            <a className={classNames({ active: this.props.selectedTabKey === 'timeline' })} onClick={() => this.selectTab('timeline')}>
                                <i className='fa argo-icon-timeline'/>
                            </a>
                            <a className={classNames({ active: this.props.selectedTabKey === 'workflow' })} onClick={() => this.selectTab('workflow')}>
                                <i className='fa argo-icon-workflow'/>
                            </a>
                        </div>
                    ),
                }}>
                <div className='workflow-details'>
                    {this.props.selectedTabKey === 'summary' && this.renderSummaryTab() || (
                        <div className='row'>
                            <div className='columns small-9'>
                                {this.props.selectedTabKey === 'workflow' && this.renderWorkflowTab()}
                            </div>
                            <div className='columns small-3 workflow-details__step-info'>
                                {selectedNode && (
                                    <WorkflowNodeInfo node={selectedNode} workflow={this.props.workflow} />
                                ) || (
                                    <p>Please select workflow node</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Page>
        );
    }

    private selectTab(tab: string) {
        this.appContext.router.history.push(`${this.props.match.url}?tab=${tab}&nodeId=${this.props.selectedNodeId}`);
    }

    private selectNode(nodeId: string) {
        this.appContext.router.history.push(`${this.props.match.url}?tab=${this.props.selectedTabKey}&nodeId=${nodeId}`);
    }

    private renderSummaryTab() {
        if (!this.props.workflow) {
            return <div>Loading...</div>;
        }
        return (
            <div className='argo-container'>
                <div className='workflow-details__content'>
                    <WorkflowSummaryPanel workflow={this.props.workflow}/>
                    <h6>Artifacts</h6>
                    <WorkflowArtifacts workflow={this.props.workflow}/>
                </div>
            </div>
        );
    }

    private renderWorkflowTab() {
        if (!this.props.workflow) {
            return <div>Loading...</div>;
        }
        return (
            <div className='workflow-details__graph-container'>
                <WorkflowDag
                    workflow={this.props.workflow}
                    selectedNodeId={this.props.selectedNodeId}
                    nodeClicked={(node) => this.selectNode(node.id)}/>
            </div>
        );
    }

    private get appContext(): AppContext {
        return this.context as AppContext;
    }
}

(Component as React.ComponentClass).contextTypes = {
    router: PropTypes.object,
};

function defaultSelectedNode(workflow: models.Workflow): string {
    if (workflow.status && workflow.status.nodes) {
        return Object.keys(workflow.status.nodes)[0];
    }
    return null;
}

export const WorkflowDetails = connect((state: AppState<State>) => ({
    workflow: state.page.workflow,
    changesSubscription: state.page.changesSubscription,
    selectedTabKey: new URLSearchParams(state.router.location.search).get('tab') || 'workflow',
    selectedNodeId: new URLSearchParams(state.router.location.search).get('nodeId') || (state.page.workflow && defaultSelectedNode(state.page.workflow)),
}), (dispatch) => ({
    onLoad: (namespace: string, name: string) => dispatch(actions.loadWorkflow(namespace, name)),
}))(Component);
