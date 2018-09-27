import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import * as models from '../../../../models';
import { uiUrl } from '../../../shared/base';
import { DataLoader, MockupList, Page, TopBarFilter } from '../../../shared/components';
import { AppContext } from '../../../shared/context';
import { services } from '../../../shared/services';

import { WorkflowListItem } from '../workflow-list-item/workflow-list-item';

export class WorkflowsList extends React.Component<RouteComponentProps<any>> {

    public static contextTypes = {
        router: PropTypes.object,
        apis: PropTypes.object,
    };

    private workflowsChanges = services.workflows.watch().filter(() => this.loader !== null && !!this.loader.getData()).map((workflowChange) => {
        let workflows = this.loader.getData().slice();
        const phasesFilter = this.phases;
        if (phasesFilter.length === 0 || phasesFilter.includes(workflowChange.object.status.phase)) {
            switch (workflowChange.type) {
                case 'ADDED':
                case 'MODIFIED':
                    const index = workflows.findIndex((item) => item.metadata.name === workflowChange.object.metadata.name);
                    if (index > -1) {
                        workflows[index] = workflowChange.object;
                    } else {
                        workflows.unshift(workflowChange.object);
                    }
                    break;
                case 'DELETED':
                    workflows = workflows.filter((item) => item.metadata.name !== workflowChange.object.metadata.name);
                    break;
            }
        }
        return workflows;
    });

    private loader: DataLoader<models.Workflow[]>;

    private get phases() {
        return new URLSearchParams(this.props.location.search).getAll('phase');
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
                        <DataLoader
                                ref={(loader) => this.loader = loader}
                                input={this.phases}
                                load={(phases) => services.workflows.list(phases)}
                                dataChanges={this.workflowsChanges}
                                loadingRenderer={() => <MockupList height={150} marginTop={30}/>}>
                            {(workflows: models.Workflow[]) => workflows.map((workflow) => (
                                <div key={workflow.metadata.name}>
                                    <Link to={uiUrl(`workflows/${workflow.metadata.namespace}/${workflow.metadata.name}`)}>
                                    <WorkflowListItem workflow={workflow}/>
                                    </Link>
                                </div>
                            ))}
                        </DataLoader>
                    </div>
                </div>
            </Page>
        );
    }

    private get appContext(): AppContext {
        return this.context as AppContext;
    }
}
