import {default as classNames} from 'classnames';
import * as React from 'react';
import { Observable } from 'rxjs';

import { DataLoader } from '../data-loader';
import { Toolbar, TopBar } from '../top-bar/top-bar';
import { Utils } from '../utils';

require('./page.scss');

interface PageProps {
    title: string;
    toolbar?: Toolbar | Observable<Toolbar>;
    topBarTitle?: string;
    useTitleOnly?: boolean;
    children?: React.ReactNode;
}

export interface PageContextProps {
    title: string;
}

export const PageContext = React.createContext<PageContextProps>({ title: 'Argo' });

export const Page = (props: PageProps) => {
    const toolbarObservable = props.toolbar && Utils.toObservable(props.toolbar);
    const [documentTitle, setDocumentTitle] = React.useState('Argo');

    React.useEffect(() => {
        document.title = documentTitle;
    }, [documentTitle]);

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
                                const nextTitle = titleParts.join(' - ');
                                if (documentTitle !== nextTitle) {
                                    setDocumentTitle(nextTitle);
                                }
                                return null;
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
