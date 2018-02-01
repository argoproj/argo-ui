import * as React from 'react';
import { NavBar } from '../nav-bar/nav-bar';
import { TopBar } from '../top-bar/top-bar';

require('./layout.scss');

const navItems = [{
    title: 'Timeline',
    path: '/workflows',
    iconClassName: 'argo-icon-timeline',
}, {
    title: 'Help',
    path: '/help',
    iconClassName: 'argo-icon-docs',
}];

export const Layout = (props: React.Props<any>) => (
    <div className='layout'>
        <TopBar/>
        <NavBar items={navItems}/>
        <div className='layout__content-wrapper'>
            {props.children}
        </div>
    </div>
);
