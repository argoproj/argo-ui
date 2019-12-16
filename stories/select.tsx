import { Store, withState } from '@dump247/storybook-state';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { Select } from '../src/components';

storiesOf('Select', module)
    .add('default', withState({ selected: 'option1' })(({store}: { store: Store<any> }) => (
        () => (
            <div>
                <h4>
                    Selected option value: {store.state.selected}
                    <button className='argo-button argo-button--base' onClick={() => store.set({ selected: 'option2' })} >Select option 2</button>
                </h4>
                <Select
                    value={store.state.selected}
                    placeholder='Select something'
                    options={['option1', { value: 'option2', title: 'Option 2' }]}
                    onChange={(option) => store.set({ selected: option.value })}
                    />
            </div>
        ))),
    ).add('multi-select', withState({ selected: 'option1' })(({store}: { store: Store<any> }) => (
        () => (
            <div>
                <Select
                    value={store.state.selected}
                    multiSelect={true}
                    placeholder='Select something'
                    options={['option1', { value: 'option2', title: 'Option 2' }]}
                    onMultiChange={(options) => store.set({ selected: options.map((item) => item.value) })}
                    />
            </div>
        ))),
    );
