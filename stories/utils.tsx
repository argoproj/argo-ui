import * as PropTypes from 'prop-types';
import * as React from 'react';

import { NotificationInfo, Notifications, NotificationsApi, NotificationsManager, PopupApi} from '../src/app/shared/components';

export class App extends React.Component<{ children: (notificationsApi: NotificationsApi) => React.ReactNode }, {notifications: NotificationInfo[]}> {
    public static childContextTypes = {
        history: PropTypes.object,
        apis: PropTypes.object,
    };

    private notificationsManager: NotificationsManager;

    constructor(props: { children: (notificationsApi: NotificationsApi) => React.ReactNode }) {
        super(props);
        this.state = { notifications: [] };
        this.notificationsManager = new NotificationsManager();
    }

    public componentDidMount() {
        this.notificationsManager.notifications.subscribe((notifications) => this.setState({ notifications }));
    }

    public render() {
        return (
            <div>
                <Notifications leftOffset={0} closeNotification={(item) => this.notificationsManager.close(item)} notifications={this.state.notifications}/>
                {this.props.children(this.notificationsManager)}
            </div>
        );
    }

    public getChildContext() {
        return { history, apis: { popup: null as PopupApi, notifications: this.notificationsManager } };
    }
}
