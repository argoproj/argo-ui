import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { AppContext } from '../../redux';

require('./nav-bar.scss');

export interface NavBarProps extends React.Props<any> {
    items: Array<{ path: string; iconClassName: string; title: string; }>;
}

export const NavBar: React.StatelessComponent<NavBarProps> = (props: NavBarProps, context: { router: AppContext }) => {
    const routerPath = context.router.route.location.pathname;
    return (
        <div className='nav-bar'>
        <div className='nav-bar__logo'>
            <img src='/assets/images/logo.png' alt='Argo'/>
            {(props.items || []).map((item) => (
                <div className={classNames('nav-bar__item', { active: routerPath === item.path })}
                     key={item.path + item.title}
                     onClick={() => context.router.history.push(item.path)}>

                    <i className={item.iconClassName}/>
                    <span className='nav-bar__item-tooltip'>{item.title}</span>

                </div>
            ))}
        </div>
    </div>);
};

NavBar.contextTypes = {
    router: PropTypes.object,
    store: PropTypes.object,
};
