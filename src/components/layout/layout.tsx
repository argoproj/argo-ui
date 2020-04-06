import * as React from 'react';
import {NavBar, NavBarItem} from '../nav-bar/nav-bar';

require('./layout.scss');

export interface LayoutProps extends React.Props<any> {
    navItems: Array<NavBarItem>;
    version?: () => React.ReactElement;
}

export const Layout = (props: LayoutProps) => (
    <div className='layout'>
        <NavBar items={props.navItems} version={props.version}/>
        {props.children}
    </div>
);
