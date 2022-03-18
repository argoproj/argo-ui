import { Checkbox } from 'antd';
import * as React from 'react';

import '../../styles/antd.less';
import '../../styles/storybook.less';


export default {
    title: 'Components/Checkbox',
    component: Checkbox,
    argTypes: {
        label: {control: {type: 'text'}},
    },
};

const style = {
    width: '50%',
    marginBottom: '1em',
    boxSizing: 'border-box',
};

export const Default = ({label, ...args}: any) => {
    return (
        <React.Fragment>
            <div style={style}>
                <Checkbox {...args}>{label}</Checkbox>
            </div>
        </React.Fragment>
    );
};

Default.args = {
    label: 'Type something here',
    indeterminate: false,
};

export const Disabled = ({label, checked}: any) => {
    return (
        <React.Fragment>
            <div style={style}>
                <Checkbox disabled={true} checked={checked}>{label}</Checkbox>
            </div>
        </React.Fragment>
    );
};

Disabled.args = {
    label: 'Type something here',
    checked: false,
};
