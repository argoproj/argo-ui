import * as React from 'react';

import { Select } from '../src/components/select/select';

export default {
  title: 'Select',
};

export const Default = () => {
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
        )
};
Default.story = {
    name: 'default',
};

export const MultiSelect = () => {
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
        )
};
MultiSelect.story = {
    name: 'multi-select',
};
