import * as React from 'react';
import {Alert} from './alert';

export default {
    title: 'Components/Alert',
    component: Alert,
    argTypes: {
        text: {control: {type: 'text'}},
        style: {control: {disable: true}},
    },
};

export const Primary = (args: any) => {
    return <Alert {...args}>{args.text}</Alert>;
};

Primary.args = {
    type: 'success',
    text: 'Hello there!',
};
