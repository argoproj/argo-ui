import * as React from 'react';
import {Brand, Header} from './header';

export default {
    component: Header,
    title: 'Components/Header',
    argTypes: {
        text: {control: {type: 'text'}},
        style: {control: {disable: true}},
    },
};

export const Primary = (args: any) => {
    return (
        <Header {...args}>
            <h1 style={{marginLeft: '10px'}}>{args.text}</h1>
        </Header>
    );
};

Primary.args = {
    text: 'Hello world!',
};

export const Secondary = (args: any) => {
    return (
        <Header>
            <Brand {...args} />
        </Header>
    );
};

Secondary.args = {
    brandName: 'Argo UX',
};
