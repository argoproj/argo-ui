import * as React from 'react';

import { App } from './utils';

import { DataLoader } from '../src/components/data-loader';

function loadData(input: string): Promise<string> {
    return new Promise((resolve) => window.setTimeout(() => resolve(`hello ${input}`), 50));
}

export default {
  title: 'Data Loader',
};

export const LoadingDataAsynchronously = () => {
    const [input, setInput] = React.useState('world');
    return (
        <App>
            {() => (
                <React.Fragment>
                    <input value={input} onChange={(e) => setInput(e.target.value)}/>
                    <DataLoader input={input} load={loadData}>
                        {(data) => (
                            <div>
                                {data}
                            </div>
                        )}
                    </DataLoader>
                </React.Fragment>
            )}
        </App>
    );
};
LoadingDataAsynchronously.storyName = 'loading data asynchronously';
