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
        title: 'New Item',
        action: () => {
            // do nothing
        },
    }],
};

storiesOf('Page', module)
    .add('default', () => (
        <Router history={createHistory()}>
            <Route path={location.pathname}>
                <Layout navItems={navItems}>
                    <Page title='Hello world!' toolbar={{ breadcrumbs, actionMenu}}>
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
