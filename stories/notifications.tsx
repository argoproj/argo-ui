import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { NotificationType} from '../src/app/shared/components';

import { App } from './utils';

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
