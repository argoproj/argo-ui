import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { NotificationInfo, Notifications, NotificationsApi, NotificationsManager, NotificationType} from '../src/app/shared/components';

class App extends React.Component<{ children: (notificationsApi: NotificationsApi) => React.ReactNode }, {notifications: NotificationInfo[]}> {
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
}

storiesOf('Notifications', module)
    .add('default', () => (
        <App>
            {(notificationsApi) => (
                <button style={{marginTop: '5em'}}
                        className='argo-button argo-button--base'
                        onClick={() => notificationsApi.show({type: NotificationType.Error, content: 'Error message!'})}>
                    Click me
                </button>
            )}
        </App>
    ));
