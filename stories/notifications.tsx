import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { NotificationType} from '../src/components';

import { App } from './utils';

const messages = [
    'Mist enveloped the ship three hours out from port. The recorded voice scratched in the speaker. Silver mist suffused the deck of the ship.',
    'Then came the night of the first falling star. A red flare silhouetted the jagged edge of a wing. She stared through the window at the stars.',
    'The spectacle before us was indeed sublime. A shining crescent far beneath the flying vessel. She stared through the window at the stars.',
];

function getMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
}

storiesOf('Notifications', module)
    .add('default', () => (
        <App>
            {(apis) => (
                [
                 {type: NotificationType.Success, title: 'Success'},
                 {type: NotificationType.Warning, title: 'Warning'},
                 {type: NotificationType.Error, title: 'Error'},
                ].map((item) => (
                    <button key={item.type} className='argo-button argo-button--base'
                            onClick={() => apis.notifications.show({type: item.type, content: <div>{getMessage()}</div>})}>
                        {item.title}
                    </button>
                ))
            )}
        </App>
    ));
