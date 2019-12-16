import { Store, withState } from '@dump247/storybook-state';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { App } from './utils';

import { DataLoader } from '../src/components/data-loader';

function loadData(input: string): Promise<string> {
    return new Promise((resolve) => window.setTimeout(() => resolve(`hello ${input}`), 50));
}

storiesOf('Data Loader', module)
    .add('loading data asynchronously', withState({ input: 'world' })(({store}: { store: Store<any> }) => (
        <App>
            {() => (
                <React.Fragment>
                    <input value={store.state.input} onChange={(e) => store.set({ input: e.target.value })}/>
                    <DataLoader input={store.state.input} load={(input) => loadData(input)}>
                        {(data) => (
                            <div>
                                {data}
                            </div>
                        )}
                    </DataLoader>
                </React.Fragment>
            )}
        </App>
    )));
