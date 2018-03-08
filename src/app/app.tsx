import createHistory from 'history/createBrowserHistory';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware} from 'react-router-redux';
import { applyMiddleware, createStore, Store } from 'redux';

import { Layout } from './shared/components';
import { AppContext, asyncMiddleware, getReducer, NotificationsContainer, RouteImplementation } from './shared/redux';

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

const reducer = getReducer(routes);
export const store = createStore(reducer, applyMiddleware(asyncMiddleware, reduxRouterMiddleware));

export const App = (props: {store: Store<any>}) => (
    <Provider store={props.store}>
        <ConnectedRouter history={history} store={props.store}>
            <Switch>
                <Redirect exact={true} path='/' to='/workflows'/>
                <Route path='/timeline' component={ class ToWorflow extends React.Component {
                    public static contextTypes = { router: PropTypes.object };
                    public render() {return <div/>; }

                    public componentWillMount() {
                        const router = (this.context as AppContext).router;
                        router.history.push(router.route.location.pathname.replace('/timeline', '/workflows'));
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
