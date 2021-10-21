import { Form, Input } from 'antd';
import * as React from 'react';

import '../../styles/antd.less';

export default {
    title: 'Components/Input',
    component: Input,
    argTypes: {
        style: {control: {disable: true}},
        innerref: {control: {disable: true}},
        placeholder: {control: {type: 'text'}},
        onChange: {action: 'inputChanged'},
    },
};

export const Default = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Input {...args} />
            </div>
        </React.Fragment>
    );
};

Default.args = {
    placeholder: 'Type something here',
};

export const Disabled = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Input disabled={true} {...args} />
            </div>
        </React.Fragment>
    );
};

Disabled.args = {
    placeholder: 'Type something here',
};

export const Error = (args: any) => {
    return (
        <div style={{width: '50%', marginBottom: '1em'}}>
            <Form>
                <Form.Item
                    validateStatus="error"
                    help="Should be combination of numbers & alphabets"
                >
                    <Input placeholder="Some error" id="error"/>
                </Form.Item>
            </Form>
        </div>
    );
};

Error.args = {
    placeholder: 'Type something here',
};

export const Warning = (args: any) => {
    return (
        <div style={{width: '50%', marginBottom: '1em'}}>

            <Form>
                <Form.Item
                    validateStatus="warning"
                    help="Should be combination of numbers & alphabets"
                >
                    <Input placeholder="Some warning" id="warning"/>
                </Form.Item>
            </Form>
        </div>
    );
};

export const Suffix = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Input
                    {...args}
                    suffix="SFX"
                />
            </div>
        </React.Fragment>
    );
};

Suffix.args = {
    placeholder: 'Type something here',
};

export const Prefix = (args: any) => {
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Input
                    prefix="PRX"
                    {...args}
                />
            </div>
        </React.Fragment>
    );
};

Suffix.args = {
    placeholder: 'Type something here',
};
