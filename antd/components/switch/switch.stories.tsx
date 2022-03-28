import {Meta} from '@storybook/react';
import {Switch} from 'antd';
import * as React from 'react';

import '../../styles/antd.less';

const argg: Meta = {
    title: 'Components/Switch',
    component: Switch,
    argTypes: {
        size: {
            control: {
                type: 'radio',
                options: ['default', 'small'],
            },
        },
        disabled: {control: {type: 'boolean'}},
        defaultChecked: {control: {type: 'boolean'}},
        loading: {control: {type: 'boolean'}},
        checkedChildren: {
            control: {type: 'number', required: false},
        },
        unCheckedChildren: {
            control: {type: 'number', required: false},
        },
    },
    args: {
        size: 'default',
        disabled: false,
        defaultChecked: false,
        loading: false,
        checkedChildren: '',
        unCheckedChildren: '',
    },
};

export default argg;


const SwitchStoryComponent = (args: any) => {
    return <Switch {...args}/>;
};

export const Default = (args: any) => <SwitchStoryComponent {...args}/>;

Default.args = {
};

export const DefaultSmall = (args: any) => <SwitchStoryComponent {...args}/>;

DefaultSmall.args = {
    size: 'small',
};

export const Checked = (args: any) => <SwitchStoryComponent {...args}/>;

Checked.args = {
    defaultChecked: true,
};

export const Disabled = (args: any) => <SwitchStoryComponent {...args}/>;

Disabled.args = {
    disabled: true,
};

export const Loading = (args: any) => <SwitchStoryComponent {...args}/>;

Loading.args = {
    loading: true,
};

export const CheckedContent = (args: any) => <SwitchStoryComponent {...args}/>;

CheckedContent.args = {
    defaultChecked: true,
    checkedChildren: 'ON',
};

export const UnCheckedContent = (args: any) => <SwitchStoryComponent {...args}/>;

UnCheckedContent.args = {
    unCheckedChildren: 'OFF',
};
