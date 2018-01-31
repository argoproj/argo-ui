import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { connect } from 'react-redux';

import { AppContext, AppState } from '../../redux';

require('./nav-bar.scss');

export interface NavBarProps extends React.Props<any> {
    items: Array<{ path: string; iconClassName: string; title: string; }>;
    routerPath?: string;
}

const component: React.StatelessComponent = (props: NavBarProps, context: { router: AppContext }) => {
    return (
        <div className='nav-bar'>
        <div className='nav-bar__logo'>
            <img src='/assets/images/logo.png' alt='Argo'/>
            {(props.items || []).map((item) => (
                <div className={classNames('nav-bar__item', { active: props.routerPath === item.path })}
                     key={item.path + item.title}
                     onClick={() => context.router.history.push(item.path)}>

                    <i className={item.iconClassName}/>
                    <span className='nav-bar__item-tooltip'>{item.title}</span>

                </div>
            ))}
        </div>
    </div>);
};

component.contextTypes = {
    router: PropTypes.object,
    store: PropTypes.object,
};

export const NavBar = connect<{}, {}, NavBarProps, AppState<any>>((state) => ({
    routerPath: state.router.location.pathname,
    router: state.router,
}))(component);
