import * as React from 'react';

import { Tabs } from '../src/components/tabs/tabs';

export default {
    title: 'Tabs',
};

export const BasicTabs = () => (
    <Tabs
        tabs={[{
            title: 'Tab 1',
            content: <p>Tab 1 content</p>,
            key: 'tab1',
        }, {
            title: 'Tab 2 with badge',
            content: <p>Tab 2 content</p>,
            key: 'tab2',
            badge: '5',
        }]}/>
);
BasicTabs.storyName = 'basic tabs';
