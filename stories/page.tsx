import { Store, withState } from '@dump247/storybook-state';
import { storiesOf } from '@storybook/react';
import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { Route, Router } from 'react-router';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { Layout, Page } from '../src/components';

const navItems = [{ path: location.pathname, title: 'Sample', iconClassName: 'argo-icon-docs' }];
const breadcrumbs = [{
    title: 'breadcrumb parent',
    path: location.pathname,
}, {
    title: 'this page breadcrumb',
}];

const actionMenu = {
    items: [{
        title: 'New Item 1',
        iconClassName: 'fa fa-history',
        action: () => {
            // do nothing
        },
    }, {
        title: 'New Item 2',
        iconClassName: 'icon argo-icon-deploy',
        action: () => {
            // do nothing
        },
    },
    {
        title: 'New Item 3',
        action: () => {
            // do nothing
        },
    },
    {
        title: 'New Item 4',
        iconClassName: 'fa fa-times-circle',
        disabled: true,
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
    ))).add('dynamic toolbar', () => (
        <Router history={history}>
            <Route path={location.pathname}>
                <Layout navItems={navItems}>
                    <Page title='Hello world!' toolbar={timer(0, 1000).pipe(map(() => ({ breadcrumbs: [{title: 'hello ' + new Date().toLocaleTimeString()}] })))}>
                        <div style={{padding: '1em'}}>
                            <div className='white-box'>
                                Hello world!
                            </div>
                        </div>
                    </Page>
                </Layout>
            </Route>
        </Router>
    )).add('compact nav bar', () => {
        const manyNavItems = [];
        for (let i = 0; i < 10; i++) {
            manyNavItems.push({ path: location.pathname + '/' + i, title: 'Sample', iconClassName: 'argo-icon-docs' });
        }
        return (
            <Router history={history}>
                <Route path={location.pathname}>
                    <Layout navItems={manyNavItems}>
                        <Page title='Hello world!'>
                            <div style={{padding: '1em'}}>
                                <div className='white-box'>
                                    Hello world!
                                </div>
                            </div>
                        </Page>
                    </Layout>
                </Route>
            </Router>
        );
    }).add('custom top bar title', () => (
        <Router history={history}>
            <Route path={location.pathname}>
                <Layout navItems={navItems}>
                    <Page title='helmet title' topBarTitle='Top Bar Title' toolbar={{ breadcrumbs: [{title: 'Apps ' , path: '/applications'}, {title: 'app name'}] }}>
                        <div style={{padding: '1em'}}>
                            <div className='white-box'>
                                Test
                            </div>
                        </div>
                    </Page>
                </Layout>
            </Route>
        </Router>
    )).add('background color', () => (
        <Router history={history}>
            <Route path={location.pathname}>
                <Layout navItems={navItems} navBarStyle={{backgroundColor: 'red'}}>
                    <Page title='Hello world!'>
                        <div style={{padding: '1em'}}>
                            <div className='white-box'>
                                Hello world!
                            </div>
                        </div>
                    </Page>
                </Layout>
            </Route>
        </Router>
    ));
