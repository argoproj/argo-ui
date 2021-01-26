import * as React from 'react';
import { NavBar, Style } from '../nav-bar/nav-bar';

require('./layout.scss');

export interface LayoutProps {
    navItems: Array<{ path: string; iconClassName: string; title: string; }>;
    version?: () => React.ReactElement;
    children?: React.ReactNode;
    navBarStyle?: Style;
}

export const Layout = (props: LayoutProps) => (
    <div className='layout'>
        <NavBar items={props.navItems} version={props.version} style={props.navBarStyle}/>
        {props.children}
    </div>
);
