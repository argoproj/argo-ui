import * as React from 'react';

import { Autocomplete } from '../src/components/autocomplete/autocomplete';

export default {
  title: 'Autocomplete',
};

export const Default = () => {
    const [value, setValue] = React.useState('');
    return (
        <div>
            <h4>Value: {value}</h4>
            <Autocomplete
                items={['apple', 'banana', 'cherry', 'apricot']}
                value={value}
                filterSuggestions={true}
                onChange={(_, val) => setValue(val)}
                onSelect={(_, item) => setValue(item.value)}
            />
        </div>
    );
};
Default.storyName = 'default';

export const WithDescription = () => {
    const [value, setValue] = React.useState('');
    return (
        <div>
            <h4>Value: {value}</h4>
            <p>Type part of a URL or a name to filter. The name is never written into the input.</p>
            <Autocomplete
                items={[
                    { value: 'https://github.com/argoproj/argocd-example-apps.git', description: 'example-apps' },
                    { value: 'https://github.com/argoproj/argo-cd.git', description: 'argo-cd' },
                    { value: 'https://github.com/org/a-repository-with-a-very-long-name-that-should-truncate.git', description: 'long-url' },
                    { value: 'https://github.com/org/no-name.git' },
                ]}
                value={value}
                filterSuggestions={true}
                onChange={(_, val) => setValue(val)}
                onSelect={(_, item) => setValue(item.value)}
            />
        </div>
    );
};
WithDescription.storyName = 'with description';
