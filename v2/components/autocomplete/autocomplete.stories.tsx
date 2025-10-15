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
        glob: {control: {type: 'boolean'}},
    },
};

export const Primary = (args: any) => {
    const [input, setInput] = React.useState('');

    const items = [
        'User',
        'AppServer',
        'AuthService',
        'Backend',
        'Cache',
        'Config',
        'Database',
        'Frontend',
        'Logger',
        'utils.js',
        'data-01.csv',
        'data-02.csv',
        'data-final.csv',
        'src/index.js',
        'src/components/Button.js',
        'src/components/Input.ts',
        'test/app.test.js',
        '.env',
        'README.md',
    ];

    return (
        <div style={{width: '50%', paddingBottom: '6em'}}>
            <Autocomplete {...args} items={items} value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
    );
};

Primary.args = {
    placeholder: 'Type something here',
};
