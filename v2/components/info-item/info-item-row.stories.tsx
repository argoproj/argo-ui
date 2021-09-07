import * as React from 'react';
import {InfoItemRow} from './info-item';

export default {
    component: InfoItemRow,
    title: 'Components/InfoItemRow',
    argTypes: {
        style: {control: {disable: true}},
    },
    args: {
        items: [{content: 'Hello world'}],
        label: 'Greeting',
    },
};

export const Primary = (args: any) => {
    return (
        <div style={{display: 'flex'}}>
            <InfoItemRow {...args} />
        </div>
    );
};
