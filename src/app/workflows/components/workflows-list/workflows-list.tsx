import deepEqual = require('deep-equal');
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Subscription } from 'rxjs';

import * as models from '../../../../models';
import { uiUrl } from '../../../shared/base';
import { MockupList, NotificationType, Page, TopBarFilter } from '../../../shared/components';
import { AppContext } from '../../../shared/context';
import { services } from '../../../shared/services';

import { WorkflowListItem } from '../workflow-list-item/workflow-list-item';

export class WorkflowsList extends React.Component<RouteComponentProps<any>, { workflows: models.Workflow[] }> {

    public static contextTypes = {
        router: PropTypes.object,
        apis: PropTypes.object,
    };

    private changesSubscription: Subscription;

    private get phases() {
        return new URLSearchParams(this.props.location.search).getAll('phase');
    }

    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { workflows: null };
    }

    public componentWillMount() {
        this.loadWorkflowsList(this.phases);
    }

    public componentWillReceiveProps(nextProps: RouteComponentProps<any>) {
        const nextPhases = new URLSearchParams(nextProps.location.search).getAll('phase');
        if (!deepEqual(this.phases, nextPhases)) {
            this.loadWorkflowsList(nextPhases);
        }
    }

    public componentWillUnmount() {
        this.ensureUnsubscribed();
    }

    public render() {
        const filter: TopBarFilter<string> = {
            items: Object.keys(models.NODE_PHASE).map((phase) => ({
                value: (models.NODE_PHASE as any)[phase],
                label: (models.NODE_PHASE as any)[phase],
            })),
            selectedValues: this.phases,
            selectionChanged: (phases) => {
                const query = phases.length > 0 ? '?' + phases.map((phase) => `phase=${phase}`).join('&') : '';
                this.appContext.router.history.push(uiUrl(`workflows${query}`));
            },
        };
        return (
            <Page title='Workflows' toolbar={{filter, breadcrumbs: [{ title: 'Workflows', path: uiUrl('workflows') }]}}>
                <div className='argo-container'>
                    <div className='stream'>
                        {this.state.workflows ? this.state.workflows.map((workflow) => (
                            <div key={workflow.metadata.name}>
                                <Link to={uiUrl(`workflows/${workflow.metadata.namespace}/${workflow.metadata.name}`)}>
                                <WorkflowListItem workflow={workflow}/>
                                </Link>
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

    private async loadWorkflowsList(phases: string[]) {
        try {
            this.setState({ workflows: (await services.workflows.list(phases)) });
            let events = services.workflows.watch();
            if (phases.length > 0) {
                events = events.filter((event) => phases.indexOf(event.object.status.phase) > -1);
            }
            this.ensureUnsubscribed();
            this.changesSubscription = events.subscribe((workflowChange) => {
                const workflows = this.state.workflows.slice();
                switch (workflowChange.type) {
                    case 'ADDED':
                    case 'MODIFIED':
                        const index = this.state.workflows.findIndex((item) => item.metadata.name === workflowChange.object.metadata.name);
                        if (index > -1) {
                            workflows[index] = workflowChange.object;
                            this.setState({ workflows });
                        } else {
                            workflows.unshift(workflowChange.object);
                            this.setState({ workflows: workflows.sort(models.compareWorkflows) });
                        }
                        break;
                    case 'DELETED':
                        this.setState({ workflows: this.state.workflows.filter((item) => item.metadata.name !== workflowChange.object.metadata.name) });
                }
            });
        } catch (e) {
            this.appContext.apis.notifications.show({
                content: 'Unable to load workflows',
                type: NotificationType.Error,
            });
        }
    }

    private ensureUnsubscribed() {
        if (this.changesSubscription) {
            this.changesSubscription.unsubscribe();
        }
        this.changesSubscription = null;
    }
}
