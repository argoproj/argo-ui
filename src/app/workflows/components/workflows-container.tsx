import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { WorkflowDetails } from './workflow-details/workflow-details';
import { WorkflowsList } from './workflows-list/workflows-list';

export const WorkflowsContainer = () => (
    <Switch>
        <Route exact={true} path='/workflows' component={WorkflowsList}/>
        <Route exact={true} path='/workflows/:name' component={WorkflowDetails}/>
    </Switch>
);
