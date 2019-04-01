import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import Tippy from '@tippy.js/react'

import { AppContext } from '../../context';

require('./nav-bar.scss');

export interface NavBarProps extends React.Props<any> {
    items: Array<{ path: string; iconClassName: string; title: string; }>;
}

export function isActiveRoute(locationPath: string, path: string) {
    return locationPath === path || locationPath.startsWith(`${path}/`);
}

export const NavBar: React.StatelessComponent<NavBarProps> = (props: NavBarProps, context: AppContext) => {
    const locationPath = context.router.route.location.pathname;
    return (
        <div className='nav-bar'>
        <div className='nav-bar__logo'>
            <img src='assets/images/logo.png' alt='Argo'/>
            {(props.items || []).map((item) => (
                <Tippy content={item.title} placement="right" arrow={true}>
                    <div className={classNames('nav-bar__item', { active: isActiveRoute(locationPath, item.path) })}
                        key={item.path + item.title}
                        onClick={() => context.router.history.push(item.path)}>

                        <i className={item.iconClassName}/>
                    </div>
                </Tippy>
            ))}
        </div>
    </div>);
};

NavBar.contextTypes = {
    router: PropTypes.object,
};
