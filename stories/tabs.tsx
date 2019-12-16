import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Tabs } from '../src/components';

storiesOf('Tabs', module)
    .add('basic tabs', () => (
        <Tabs tabs={[{
            title: 'Tab 1',
            content: <p>Tab 1 content</p>,
            key: 'tab1',
        }, {
            title: 'Tab 2 with badge',
            content: <p>Tab 2 content</p>,
            key: 'tab2',
            badge: '5',
        }]}/>
    ));
