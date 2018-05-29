import createHistory from 'history/createBrowserHistory';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Router, Switch } from 'react-router';

import { uiUrl } from './shared/base';
import { Layout, NotificationInfo, Notifications, NotificationsManager, Popup, PopupManager, PopupProps } from './shared/components';
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

export class App extends React.Component<{}, { notifications: NotificationInfo[], popupProps: PopupProps }> {
    public static childContextTypes = {
        history: PropTypes.object,
        apis: PropTypes.object,
    };

    private popupManager: PopupManager;
    private notificationsManager: NotificationsManager;

    constructor(props: {}) {
        super(props);
        this.state = { notifications: [], popupProps: null };
        this.popupManager = new PopupManager();
        this.notificationsManager = new NotificationsManager();
    }

    public componentDidMount() {
        this.popupManager.popupProps.subscribe((popupProps) => this.setState({ popupProps }));
        this.notificationsManager.notifications.subscribe((notifications) => this.setState({ notifications }));
    }

    public render() {
        return (
            <div>
                {this.state.popupProps && <Popup {...this.state.popupProps}/>}
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
                            <Notifications leftOffset={60} closeNotification={(item) => this.notificationsManager.close(item)} notifications={this.state.notifications}/>
                            {Object.keys(routes).map((path) => {
                                const route = routes[path];
                                return <Route key={path} path={path} component={route.component}/>;
                            })}
                        </Layout>
                    </Switch>
                </Router>
            </div>
        );
    }

    public getChildContext() {
        return { history, apis: { popup: this.popupManager, notifications: this.notificationsManager } };
    }
}
