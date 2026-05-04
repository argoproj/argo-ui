import * as React from 'react';
import { createMemoryHistory } from 'history';

import { Notifications } from '../src/components/notifications/notifications';
import { NotificationsApi, NotificationsManager } from '../src/components/notifications/notification-manager';
import { Popup, PopupProps } from '../src/components/popup/popup';
import { PopupApi, PopupManager } from '../src/components/popup/popup-manager';
import { AppContext, AppContextReact } from '../src/context';

export class App extends React.Component<{ children: (apis: {
    notifications: NotificationsApi,
    popup: PopupApi,
}) => React.ReactNode }, { popupProps: PopupProps }> {

    private popupManager: PopupManager;
    private notificationsManager: NotificationsManager;
    private history = createMemoryHistory();

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
        const contextValue: AppContext = {
            history: this.history,
            router: {
                history: this.history,
                route: {
                    location: this.history.location,
                    match: {} as any,
                },
            },
            apis: {
                popup: this.popupManager,
                notifications: this.notificationsManager,
            },
        };

        return (
            <AppContextReact.Provider value={contextValue}>
                <div>
                    <Notifications notifications={this.notificationsManager.notifications}/>
                    {this.state.popupProps && <Popup {...this.state.popupProps}/>}
                    {this.props.children({ notifications: this.notificationsManager, popup: this.popupManager })}
                </div>
            </AppContextReact.Provider>
        );
    }
}
