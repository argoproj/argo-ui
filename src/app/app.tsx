import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { WorkflowsListPage } from './workflows';

export const App = () => (
    <Switch>
        <Redirect exact={true} path='/' to='/workflows'/>
        <Route path='/workflows' component={WorkflowsListPage}/>
    </Switch>
);
