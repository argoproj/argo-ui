import * as React from 'react';
import {InfoItem} from './info-item';

export default {
    component: InfoItem,
    title: 'Components/InfoItem',
    argTypes: {
        style: {control: {disable: true}},
    },
    args: {
        content: 'Hello world',
    },
};

export const Primary = (args: any) => {
    return (
        <div style={{display: 'flex'}}>
            <InfoItem {...args} />
        </div>
    );
};
