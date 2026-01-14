import { action } from '@storybook/addon-actions';
import * as React from 'react';

import { SplitButton } from '../src/components/split-button/split-button';

export default {
    title: 'SplitButton',
};

export const Default = () => (
    <SplitButton
        title='REFRESH'
        action={() => action('Primary action')()}
        subActions={[
            { title: 'Hard Refresh', action: () => action('Hard Refresh')() },
            { title: 'Soft Refresh', action: () => action('Soft Refresh')() },
        ]}
    />
);
Default.storyName = 'default';

export const WithIcon = () => (
    <SplitButton
        title='REFRESH'
        iconClassName='fa fa-refresh'
        action={() => action('Primary action')()}
        subActions={[
            { title: 'Hard Refresh', iconClassName: 'fa fa-bolt', action: () => action('Hard Refresh')() },
            { title: 'Soft Refresh', iconClassName: 'fa fa-sync', action: () => action('Soft Refresh')() },
        ]}
    />
);
WithIcon.storyName = 'with icon';

export const Disabled = () => (
    <SplitButton
        title='REFRESH'
        iconClassName='fa fa-refresh'
        disabled={true}
        action={() => action('Primary action')()}
        subActions={[
            { title: 'Hard Refresh', action: () => action('Hard Refresh')() },
            { title: 'Soft Refresh', action: () => action('Soft Refresh')() },
        ]}
    />
);
Disabled.storyName = 'disabled';

export const MultipleSubActions = () => (
    <SplitButton
        title='SYNC'
        iconClassName='fa fa-sync'
        action={() => action('Sync')()}
        subActions={[
            { title: 'Sync (Force)', action: () => action('Sync Force')() },
            { title: 'Sync (Local)', action: () => action('Sync Local')() },
            { title: 'Sync (Prune)', action: () => action('Sync Prune')() },
            { title: 'Sync (Dry Run)', action: () => action('Sync Dry Run')() },
        ]}
    />
);
MultipleSubActions.storyName = 'multiple sub-actions';

export const InToolbar = () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button className='argo-button argo-button--base'>DETAILS</button>
        <button className='argo-button argo-button--base'>DIFF</button>
        <SplitButton
            title='REFRESH'
            iconClassName='fa fa-refresh'
            action={() => action('Refresh')()}
            subActions={[
                { title: 'Hard Refresh', action: () => action('Hard Refresh')() },
                { title: 'Soft Refresh', action: () => action('Soft Refresh')() },
            ]}
        />
        <button className='argo-button argo-button--base'>DELETE</button>
    </div>
);
InToolbar.storyName = 'in toolbar';
