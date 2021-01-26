import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { AppContext } from '../../context';
import {Tooltip} from '../tooltip/tooltip';

require('./nav-bar.scss');

export interface Style {
    light?: boolean;
    compact?: boolean;
}

export interface NavBarProps {
    items: Array<{ path: string; iconClassName: string; title: string; }>;
    version?: () => React.ReactElement;
    style?: Style;
}

export function isActiveRoute(locationPath: string, path: string) {
    return locationPath === path || locationPath.startsWith(`${path}/`);
}

export const NavBar: React.FunctionComponent<NavBarProps> = (props: NavBarProps, context: AppContext) => {
    const viewModifications = props.style || {};
    const locationPath = context.router.route.location.pathname;
    return (
        <div className={classNames('nav-bar', {
            'nav-bar--compact': !!viewModifications.compact,
            'nav-bar--light': !!viewModifications.light,
        })}>
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
