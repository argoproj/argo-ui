import * as React from 'react';
import { NavBar } from '../nav-bar/nav-bar';

require('./layout.scss');

export interface LayoutProps extends React.Props<any> {
    navItems: Array<{ path: string; iconClassName: string; title: string; }>;
}

export const Layout = (props: LayoutProps) => (
    <div className='layout'>
        <NavBar items={props.navItems}/>
        {props.children}
    </div>
);
