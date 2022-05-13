import {default as classNames} from 'classnames';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Observable } from 'rxjs';

import { DataLoader } from '../data-loader';
import { Toolbar, TopBar } from '../top-bar/top-bar';
import { Utils } from '../utils';

require('./page.scss');

interface PageProps extends React.Props<any> {
    title: string;
    toolbar?: Toolbar | Observable<Toolbar>;
    topBarTitle?: string;
    useTitleOnly?: boolean;
}

export interface PageContextProps {
    title: string;
}

export const PageContext = React.createContext<PageContextProps>({ title: 'Argo' });

export const Page = (props: PageProps) => {
    const toolbarObservable = props.toolbar && Utils.toObservable(props.toolbar);

    return (
        <div className={classNames('page', { 'page--has-toolbar': !!props.toolbar })}>
            <React.Fragment>
                {toolbarObservable && <DataLoader input={new Date()} load={() => toolbarObservable}>
                {(toolbar: Toolbar) => (
                    <React.Fragment>
                        <PageContext.Consumer>
                            {(ctx) => {
                                let titleParts = [ctx.title];
                                if (!props.useTitleOnly && toolbar && toolbar.breadcrumbs && toolbar.breadcrumbs.length > 0) {
                                    titleParts = [toolbar.breadcrumbs.map((item) => item.title).reverse().join(' / ')].concat(titleParts);
                                } else if (props.title) {
                                    titleParts = [props.title].concat(titleParts);
                                }
                                return (
                                    <Helmet>
                                        <title>{titleParts.join(' - ')}</title>
                                    </Helmet>
                                );
                            }}
                        </PageContext.Consumer>
                        <div className='page__top-bar'>
                            <TopBar title={props.topBarTitle ? props.topBarTitle : props.title} toolbar={toolbar}/>
                        </div>
                    </React.Fragment>
                )}
                </DataLoader>}
                <div className='page__content-wrapper'>
                    {props.children}
                </div>
            </React.Fragment>
        </div>
    );
};
