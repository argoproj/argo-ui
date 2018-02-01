import * as React from 'react';
import { TopBar } from '../top-bar/top-bar';

require('./page.scss');

export const Page = (props: { title: string } & React.Props<any>) => (
    <div className='page'>
        <TopBar title={props.title}/>
        <div className='page__content-wrapper'>
            <div className='content'>
                {props.children}
            </div>
        </div>
    </div>
);
