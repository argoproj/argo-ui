import createHistory from 'history/createBrowserHistory';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware} from 'react-router-redux';
import { applyMiddleware, createStore, Store } from 'redux';

import { uiUrl } from './shared/base';
import { Layout } from './shared/components';
import { AppContext, asyncMiddleware, getReducer, NotificationsContainer, RouteImplementation } from './shared/redux';

export const history = createHistory();
const reduxRouterMiddleware = routerMiddleware(history);

import help from './help';
import workflows from './workflows';

const workflowsUrl = uiUrl('workflows');
const helpUrl = uiUrl('help');
const timelineUrl = uiUrl('timeline');
const routes: {[path: string]: RouteImplementation } = {
    [workflowsUrl]: { component: workflows.component, reducer: workflows.reducer },
    [helpUrl]: { component: help.component, reducer: help.reducer },
};

const navItems = [{
    title: 'Timeline',
    path: workflowsUrl,
    iconClassName: 'argo-icon-timeline',
}, {
    title: 'Help',
    path: helpUrl,
    iconClassName: 'argo-icon-docs',
}];

const reducer = getReducer(routes);
export const store = createStore(reducer, applyMiddleware(asyncMiddleware, reduxRouterMiddleware));

export const App = (props: {store: Store<any>}) => (
    <Provider store={props.store}>
        <ConnectedRouter history={history} store={props.store}>
            <Switch>
                <Redirect exact={true} path={uiUrl('')} to={workflowsUrl}/>
                <Route path={timelineUrl} component={ class ToWorkflows extends React.Component {
                    public static contextTypes = { router: PropTypes.object };
                    public render() {return <div/>; }

                    public componentWillMount() {
                        const router = (this.context as AppContext).router;
                        router.history.push(router.route.location.pathname.replace(timelineUrl, workflowsUrl));
                    }
                } }/>
                <Layout navItems={navItems}>
                    <NotificationsContainer />
                    {Object.keys(routes).map((path) => {
                        const route = routes[path];
                        return <Route key={path} path={path} component={route.component}/>;
                    })}
                </Layout>
            </Switch>
        </ConnectedRouter>
    </Provider>
);
