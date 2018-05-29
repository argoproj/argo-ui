import createHistory from 'history/createBrowserHistory';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Router, Switch } from 'react-router';

import { uiUrl } from './shared/base';
import { Layout } from './shared/components';
import { AppContext } from './shared/context';

export const history = createHistory();

import help from './help';
import workflows from './workflows';

const workflowsUrl = uiUrl('workflows');
const helpUrl = uiUrl('help');
const timelineUrl = uiUrl('timeline');
const routes: {[path: string]: { component: React.ComponentType<RouteComponentProps<any>> } } = {
    [workflowsUrl]: { component: workflows.component },
    [helpUrl]: { component: help.component },
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

export const App = () => (
    <div>
        <Router history={history}>
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
                    {/* <NotificationsContainer /> */}
                    {Object.keys(routes).map((path) => {
                        const route = routes[path];
                        return <Route key={path} path={path} component={route.component}/>;
                    })}
                </Layout>
            </Switch>
        </Router>
    </div>
);
