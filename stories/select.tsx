import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { Select } from '../src/components/select/select';

storiesOf('Select', module)
    .add('default', () => {
        const [selected, setSelected] = React.useState('option1');
        return (
            <div>
                <h4>
                    Selected option value: {selected}
                    <button className='argo-button argo-button--base' onClick={() => setSelected('option2')} >Select option 2</button>
                </h4>
                <Select
                    value={selected}
                    placeholder='Select something'
                    options={['option1', { value: 'option2', title: 'Option 2' }]}
                    onChange={(option) => setSelected(option.value)}
                    />
            </div>
        )},
    ).add('multi-select', () => {
        const [selected, setSelected] = React.useState(['option1']);
        return (
            <div>
                <Select
                    value={selected}
                    multiSelect={true}
                    placeholder='Select something'
                    options={['option1', { value: 'option2', title: 'Option 2' }]}
                    onMultiChange={(options) => setSelected(options.map((item) => item.value))}
                    />
            </div>
        )},
    );
