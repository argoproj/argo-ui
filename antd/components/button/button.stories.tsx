import { DownloadOutlined } from '@ant-design/icons';
import {Meta} from '@storybook/react';
import * as React from 'react';

import { Button } from 'antd';

import '../../styles/antd.less';

const argg: Meta = {
    title: 'Components/Button',
    component: Button,
    argTypes: {
        type: {
            control: {
                type: 'select',
                options: ['primary', 'ghost', 'dashed', 'link', 'text', 'default'],
            },
        },
        shape: {
            control: {
                type: 'select',
                options: ['default', 'circle', 'round'],
            },
        },
        size: {
            control: {
                type: 'select',
                options: ['small', 'middle', 'large'],
            },
        },
        children: {control: {type: 'text'}},
        disabled: {control: {type: 'boolean'}},
        danger: {control: {type: 'boolean'}},
        icon: {control: {type: 'boolean'}},
    },
    args: {
        type: 'default',
        shape: 'default',
        size: 'middle',
        children: 'My button',
        disabled: false,
        danger: false,
        icon: false,
    },
};

export default argg;

const ButtonStoryComponent = (args: any) => {
    return (
        <div style={{width: '50%', marginBottom: '1em'}}>
            <Button {...args} icon={args.icon && <DownloadOutlined />} />
        </div>
    );
};

export const Primary = (args: any) => <ButtonStoryComponent {...args} />;

Primary.args = {
    type: 'primary',
    children: 'My button',
};

export const Default = (args: any) => <ButtonStoryComponent {...args} />;

Default.args = {
    type: 'secondary',
    children: 'My button',
};

export const Ghost = (args: any) => <ButtonStoryComponent {...args} />;

Ghost.args = {
    type: 'ghost',
    children: 'My button',
};

export const Text = (args: any) => <ButtonStoryComponent {...args} />;

Text.args = {
    type: 'text',
    children: 'My button',
};

export const Disabled = (args: any) => <ButtonStoryComponent {...args} />;

Disabled.args = {
    children: 'My button',
    disabled: true,
};

export const Danger = (args: any) => <ButtonStoryComponent {...args} />;

Danger.args = {
    type: 'primary',
    danger: true,
    children: 'My button',
};

export const DangerGhost = (args: any) => <ButtonStoryComponent {...args} />;

DangerGhost.args = {
    type: 'primary',
    danger: true,
    ghost: true,
    children: 'My button',
};

export const DangerText = (args: any) => <ButtonStoryComponent {...args} />;

DangerText.args = {
    type: 'text',
    danger: true,
    children: 'My button',
};
