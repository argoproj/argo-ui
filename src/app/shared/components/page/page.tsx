import * as classNames from 'classnames';
import * as React from 'react';
import { Helmet } from 'react-helmet';

import { TopBar, TopBarProps } from '../top-bar/top-bar';

require('./page.scss');

type PageProps = TopBarProps;

export interface PageContextProps {
    title: string;
}

export const PageContext = React.createContext<PageContextProps>({ title: 'Argo' });

export const Page = (props: PageProps) => (
    <div className={classNames('page', { 'page--has-toolbar': !!props.toolbar })}>
        <PageContext.Consumer>
            {(ctx) => {
                const titleParts = [ctx.title];
                if (props.toolbar && props.toolbar.breadcrumbs && props.toolbar.breadcrumbs.length > 0) {
                    titleParts.push(props.toolbar.breadcrumbs.map((item) => item.title).join(' / '));
                } else if (props.title) {
                    titleParts.push(props.title);
                }
                return (
                    <Helmet>
                        <title>{titleParts.join(' - ')}</title>
                    </Helmet>
                );
            }}
        </PageContext.Consumer>
        <div className='page__top-bar'>
            <TopBar {...props}/>
        </div>
        <div className='page__content-wrapper'>
            {props.children}
        </div>
    </div>
);
