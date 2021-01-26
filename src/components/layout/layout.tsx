import * as React from 'react';
import { NavBar } from '../nav-bar/nav-bar';

require('./layout.scss');

export interface LayoutProps {
    navItems: Array<{ path: string; iconClassName: string; title: string; }>;
    version?: () => React.ReactElement;
    children?: React.ReactNode;
}

export const Layout = (props: LayoutProps) => (
    <div className='layout'>
        <NavBar items={props.navItems} version={props.version}/>
        {props.children}
    </div>
);
