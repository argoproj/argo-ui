import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { NotificationType} from '../src/app/shared/components';

import { App } from './utils';

storiesOf('Notifications', module)
    .add('default', () => (
        <App>
            {(apis) => (
                <button style={{marginTop: '5em'}}
                        className='argo-button argo-button--base'
                        onClick={() => apis.notifications.show({type: NotificationType.Error, content: <div>Hello world</div>})}>
                    Click me
                </button>
            )}
        </App>
    )).add('styled', () => (
        <App>
            {(apis) => (
                <button style={{marginTop: '5em'}}
                        className='argo-button argo-button--base'
                        onClick={() => apis.notifications.show({
                            style: { backgroundColor: 'blue' }, type: NotificationType.Error, content: <div>Hello world</div>,
                        })}>
                    Click me
                </button>
            )}
        </App>
    ));
