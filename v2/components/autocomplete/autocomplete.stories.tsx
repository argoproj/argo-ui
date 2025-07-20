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
        wildcard: {control: {type: 'boolean'}},
    },
};

export const Primary = (args: any) => {
    const [input, setInput] = React.useState('');

    return (
        <div style={{width: '50%', paddingBottom: '6em'}}>
            <Autocomplete {...args} items={['hello', 'world', 'hello world', 'hello world2']} value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
    );
};

Primary.args = {
    placeholder: 'Type something here',
};
