import * as React from 'react';
import { TopBar, TopBarProps } from '../top-bar/top-bar';

require('./page.scss');

type PageProps = TopBarProps;

export const Page = (props: PageProps) => (
    <div className='page'>
        <TopBar {...props}/>
        <div className='page__content-wrapper'>
            {props.children}
        </div>
    </div>
);
