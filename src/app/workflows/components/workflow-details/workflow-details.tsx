import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import * as models from '../../../../models';
import { Page, Tabs } from '../../../shared/components';
import { AppState } from '../../../shared/redux';
import * as actions from '../../actions';
import { State } from '../../state';
import { WorkflowArtifacts } from '../workflow-artifacts/workflow-artifacts';

interface Props extends RouteComponentProps<{ name: string; namespace: string; }> {
    workflow: models.Workflow;
    onLoad: (namespace: string, name: string) => any;
}

class Component extends React.Component<Props, any> {

    public componentWillMount() {
        this.props.onLoad(this.props.match.params.namespace, this.props.match.params.name);
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.match.params.name !== nextProps.match.params.name || this.props.match.params.namespace !== nextProps.match.params.namespace) {
            this.props.onLoad(nextProps.match.params.namespace, nextProps.match.params.name);
        }
    }

    public render() {
        const tabProps = { isOnlyContentScrollable: true, extraHorizontalScrollPadding: 65, extraVerticalScrollPadding: 108 };
        return (
            <Page title={`${this.props.match.params.namespace}/${this.props.match.params.name}`}>
                <Tabs fixed={true} tabs={[
                    {...tabProps, key: 'summary', title: 'SUMMARY', content: this.renderSummaryTab.bind(this) },
                    {...tabProps, key: 'workflow', title: 'WORKFLOW', content: this.renderWorkflowTab.bind(this) },
                    {...tabProps, key: 'artifacts', title: 'ARTIFACTS', content: this.renderArtifactsTab.bind(this) },
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
        return (
            <div>
                Workflow tab
            </div>
        );
    }

    private renderArtifactsTab() {
        if (!this.props.workflow) {
            return <div>Loading...</div>;
        }
        return <WorkflowArtifacts workflow={this.props.workflow}/>;
    }
}

export const WorkflowDetails = connect((state: AppState<State>) => {
    return {
        workflow: state.page.workflow,
    };
}, (dispatch) => ({
    onLoad: (namespace: string, name: string) => dispatch(actions.loadWorkflow(namespace, name)),
}))(Component);
