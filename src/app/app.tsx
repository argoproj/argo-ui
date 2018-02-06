import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware} from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';

import { Layout } from './shared/components';
import { asyncMiddleware, getRoutesReducer, RouteImplementation } from './shared/redux';

export const history = createHistory();
const reduxRouterMiddleware = routerMiddleware(history);

import help from './help';
import workflows from './workflows';
const routes: {[path: string]: RouteImplementation } = {
    '/workflows': { component: workflows.component, reducer: workflows.reducer },
    '/help': { component: help.component, reducer: help.reducer },
};

const navItems = [{
    title: 'Timeline',
    path: '/workflows',
    iconClassName: 'argo-icon-timeline',
}, {
    title: 'Help',
    path: '/help',
    iconClassName: 'argo-icon-docs',
}];

const reducer = getRoutesReducer(routes);
export const store = createStore(reducer, applyMiddleware(asyncMiddleware, reduxRouterMiddleware));

require('./app.scss');
export const App = () => (
    <Provider store={store}>
        <ConnectedRouter history={history} store={store}>
            <Switch>
                <Redirect exact={true} path='/' to='/workflows'/>
                <Layout navItems={navItems}>
                    {Object.keys(routes).map((path) => {
                        const route = routes[path];
                        return <Route key={path} path={path} component={route.component}/>;
                    })}
                </Layout>
            </Switch>
        </ConnectedRouter>
    </Provider>
);
