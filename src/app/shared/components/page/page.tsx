import * as classNames from 'classnames';
import * as React from 'react';
import { TopBar, TopBarProps } from '../top-bar/top-bar';

require('./page.scss');

type PageProps = TopBarProps;

export const Page = (props: PageProps) => (
    <div className={classNames('page', { 'page--has-toolbar': !!props.toolbar })}>
        <div className='page__top-bar'>
            <TopBar {...props}/>
        </div>
        <div className='page__content-wrapper'>
            {props.children}
        </div>
    </div>
);
