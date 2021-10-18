import {Meta} from '@storybook/react';
import * as React from 'react';
import { Button } from '../../index';

import '../../antd.less';

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
    },
    args: {
        type: 'default',
        shape: 'default',
        size: 'middle',
        children: 'My button',
        disabled: false,
        danger: false,
    },
};

export default argg;

export const Primary = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Button {...args} />
            </div>
        </React.Fragment>
    );
};

Primary.args = {
    type: 'primary',
    children: 'My button',
};

export const Default = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Button {...args} />
            </div>
        </React.Fragment>
    );
};

Default.args = {
    type: 'secondary',
    children: 'My button',
};

export const Ghost = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Button {...args} />
            </div>
        </React.Fragment>
    );
};

Ghost.args = {
    type: 'ghost',
    children: 'My button',
};

export const Text = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Button {...args} />
            </div>
        </React.Fragment>
    );
};

Text.args = {
    type: 'text',
    children: 'My button',
};

export const Danger = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Button {...args} />
            </div>
        </React.Fragment>
    );
};

Danger.args = {
    type: 'primary',
    danger: true,
    children: 'My button',
};

export const DangerGhost = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Button {...args} />
            </div>
        </React.Fragment>
    );
};

DangerGhost.args = {
    type: 'primary',
    danger: true,
    ghost: true,
    children: 'My button',
};

export const DangerText = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Button {...args} />
            </div>
        </React.Fragment>
    );
};

DangerText.args = {
    type: 'text',
    danger: true,
    children: 'My button',
};
