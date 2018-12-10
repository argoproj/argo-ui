import { Store, withState } from '@dump247/storybook-state';
import { storiesOf } from '@storybook/react';
import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { Route, Router } from 'react-router';

import { Layout, Page } from '../src/app/shared/components';

const navItems = [{ path: location.pathname, title: 'Sample', iconClassName: 'argo-icon-docs' }];
const breadcrumbs = [{
    title: 'breadcrumb parent',
    path: location.pathname,
}, {
    title: 'this page breadcrumb',
}];

const actionMenu = {
    className: 'fa fa-plus',
    items: [{
        title: 'New Item1',
        iconClassName: 'fa fa-history',
        action: () => {
            // do nothing
        },
    }, {
        title: 'New Item2',
        iconClassName: 'fa fa-history',
        action: () => {
            // do nothing
        },
    }],
};

const history = createHistory();

function ensureSelected(vals: string[], selected: string[]): string[] {
    const res = new Set(selected);
    vals.forEach((item) => res.add(item));
    return Array.from(res);
}

storiesOf('Page', module)
    .add('default',  withState({ selectedFilter: [] })(({store}: { store: Store<any> }) => (
        <Router history={history}>
            <Route path={location.pathname}>
                <Layout navItems={navItems}>
                    <Page title='Hello world!' toolbar={{ breadcrumbs, actionMenu, filter: {
                        items: [
                            { content: (changeSelection) => (
                                <React.Fragment>
                                    Filter type one: <a onClick={() => changeSelection(ensureSelected(['1', '2'], store.state.selectedFilter))}>all</a>
                                </React.Fragment>
                            )},
                            {label: 'filter 1', value: '1' },
                            {label: 'filter 2', value: '2' },
                            { content: (changeSelection) => (
                                <React.Fragment>
                                    Filter type two: <a onClick={() => changeSelection(ensureSelected(['3', '4'], store.state.selectedFilter))}>all</a>
                                </React.Fragment>
                            )},
                            {label: 'filter 3', value: '3' },
                            {label: 'filter 4', value: '4' },
                        ],
                        selectedValues: store.state.selectedFilter,
                        selectionChanged: (vals) => {
                            store.set({ selectedFilter: vals });
                        },
                    }}}>
                        <div style={{padding: '1em'}}>
                            <div className='white-box'>
                                Hello world!
                            </div>
                        </div>
                    </Page>
                </Layout>
            </Route>
        </Router>
    )));
