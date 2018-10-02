import * as PropTypes from 'prop-types';
import * as React from 'react';

import { NotificationInfo, Notifications, NotificationsApi, NotificationsManager, Popup, PopupApi, PopupManager, PopupProps} from '../src/app/shared/components';

export class App extends React.Component<{ children: (apis: {
    notifications: NotificationsApi,
    popup: PopupApi,
}) => React.ReactNode }, {
    popupProps: PopupProps,
    notifications: NotificationInfo[]}> {

    public static childContextTypes = {
        history: PropTypes.object,
        apis: PropTypes.object,
    };

    private popupManager: PopupManager;
    private notificationsManager: NotificationsManager;

    constructor(props: { children: (apis: { notifications: NotificationsApi, popup: PopupApi }) => React.ReactNode }) {
        super(props);
        this.state = { notifications: [], popupProps: null };
        this.notificationsManager = new NotificationsManager();
        this.popupManager = new PopupManager();
    }

    public componentDidMount() {
        this.notificationsManager.notifications.subscribe((notifications) => this.setState({ notifications }));
        this.popupManager.popupProps.subscribe((popupProps) => this.setState({ popupProps }));
    }

    public render() {
        return (
            <div>
                <Notifications leftOffset={0} closeNotification={(item) => this.notificationsManager.close(item)} notifications={this.state.notifications}/>
                {this.state.popupProps && <Popup {...this.state.popupProps}/>}
                {this.props.children({ notifications: this.notificationsManager, popup: this.popupManager })}
            </div>
        );
    }

    public getChildContext() {
        return { history, apis: { popup: this.popupManager, notifications: this.notificationsManager } };
    }
}
