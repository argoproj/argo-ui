import {default as classNames} from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { AppContext } from '../../context';
import {Tooltip} from '../tooltip/tooltip';

require('./nav-bar.scss');

export interface NavBarProps {
    items: Array<{ path: string; iconClassName: string; title: string; }>;
    version?: () => React.ReactElement;
    style?: NavBarStyle;
}

export interface NavBarStyle {
    backgroundColor?: string;
}

export function isActiveRoute(locationPath: string, path: string) {
    return locationPath === path || locationPath.startsWith(`${path}/`);
}

export const NavBar: React.FunctionComponent<NavBarProps> = (props: NavBarProps, context: AppContext) => {
    const locationPath = context.router.route.location.pathname;
    const navBarStyle = {
        ...(props.style?.backgroundColor && {background: `linear-gradient(to bottom, ${props.style?.backgroundColor}, #999`}),
    };
    return (
        <div className={classNames('nav-bar', {
            'nav-bar--compact': (props.items || []).length >= 10,
        })} style={navBarStyle}>
            <div className='nav-bar__logo'>
                <img src='assets/images/logo.png' alt='Argo'/>
                <div className='nav-bar__version'>{props.version && props.version()}</div>
                {(props.items || []).map((item) => (
                    <Tooltip content={item.title} placement='right' arrow={true} key={item.path + item.title}>
                        <div className={classNames('nav-bar__item', { active: isActiveRoute(locationPath, item.path) })}
                            onClick={() => context.router.history.push(item.path)}>
                            <i className={item.iconClassName}/>
                        </div>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};

NavBar.contextTypes = {
    router: PropTypes.object,
};
