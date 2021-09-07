import * as React from 'react';
import {Autocomplete} from './autocomplete';

export default {
    title: 'Components/Autocomplete',
    component: Autocomplete,
    argTypes: {
        onItemClick: {action: 'itemClicked'},
        items: {control: {type: 'object'}},
        inputStyle: {control: {disable: true}},
        placeholder: {control: {type: 'text'}},
    },
};

export const Primary = (args: any) => (
    <div style={{width: '50%', paddingBottom: '6em'}}>
        <Autocomplete {...args} items={['hello', 'world']} />
    </div>
);

Primary.args = {
    placeholder: 'Type something here',
};
