import * as PropTypes from 'prop-types';
import * as React from 'react';

import { Notifications, NotificationsApi, NotificationsManager, Popup, PopupApi, PopupManager, PopupProps} from '../src/components';

export class App extends React.Component<{ children: (apis: {
    notifications: NotificationsApi,
    popup: PopupApi,
}) => React.ReactNode }, { popupProps: PopupProps }> {

    public static childContextTypes = {
        history: PropTypes.object,
        apis: PropTypes.object,
    };

    private popupManager: PopupManager;
    private notificationsManager: NotificationsManager;

    constructor(props: { children: (apis: { notifications: NotificationsApi, popup: PopupApi }) => React.ReactNode }) {
        super(props);
        this.state = { popupProps: null };
        this.notificationsManager = new NotificationsManager();
        this.popupManager = new PopupManager();
    }

    public componentDidMount() {
        this.popupManager.popupProps.subscribe((popupProps) => this.setState({ popupProps }));
    }

    public render() {
        return (
            <div>
                <Notifications notifications={this.notificationsManager.notifications}/>
                {this.state.popupProps && <Popup {...this.state.popupProps}/>}
                {this.props.children({ notifications: this.notificationsManager, popup: this.popupManager })}
            </div>
        );
    }

    public getChildContext() {
        return { history, apis: { popup: this.popupManager, notifications: this.notificationsManager } };
    }
}
