import * as React from 'react';
import ActionButton from '../action-button/action-button';
import {Menu} from './menu';

export default {
    component: Menu,
    title: 'Components/Menu',
};

export const Primary = (args: any) => {
    return (
        <div style={{display: 'flex', marginBottom: '6em'}}>
            <Menu {...args}>
                <ActionButton label='Click me!' />
            </Menu>
        </div>
    );
};

Primary.args = {
    items: ['A', 'B', 'C'],
};
