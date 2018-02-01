import * as React from 'react';
import { NavBar } from '../nav-bar/nav-bar';

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
        <NavBar items={navItems}/>
        {props.children}
    </div>
);
