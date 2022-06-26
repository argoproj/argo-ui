import * as React from 'react';
import {NavBar, NavBarStyle} from '../nav-bar/nav-bar';

require('./layout.scss');

export interface LayoutProps {
    navItems: Array<{ path: string; iconClassName: string; title: string; }>;
    version?: () => React.ReactElement;
    navBarStyle?: NavBarStyle;
    theme?: string;
    children?: React.ReactNode;
}

export const Layout = (props: LayoutProps) => (
    <div className={props.theme ? 'theme-' + props.theme : 'theme-light'}>
        <div className='layout'>
        <NavBar items={props.navItems} version={props.version} style={props.navBarStyle} />
        {props.children}
        </div>
    </div>
);
