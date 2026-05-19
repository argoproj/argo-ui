import {default as classNames} from 'classnames';
import * as React from 'react';
import { Observable } from 'rxjs';

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
    const toolbarObservable = React.useMemo(
        () => props.toolbar && Utils.toObservable(props.toolbar),
        [props.toolbar],
    );
    const ctx = React.useContext(PageContext);
    const [toolbar, setToolbar] = React.useState<Toolbar | undefined>(undefined);

    React.useEffect(() => {
        if (!toolbarObservable) {
            setToolbar(undefined);
            return undefined;
        }
        const subscription = toolbarObservable.subscribe(setToolbar);
        return () => subscription.unsubscribe();
    }, [toolbarObservable]);

    React.useEffect(() => {
        let titleParts = [ctx.title];
        if (!props.useTitleOnly && toolbar?.breadcrumbs?.length) {
            titleParts = [toolbar.breadcrumbs.map((b) => b.title).reverse().join(' / ')].concat(titleParts);
        } else if (props.title) {
            titleParts = [props.title].concat(titleParts);
        }
        document.title = titleParts.join(' - ');
    }, [ctx.title, toolbar, props.title, props.useTitleOnly]);

    return (
        <div className={classNames('page', { 'page--has-toolbar': !!props.toolbar })}>
            {toolbar && (
                <div className='page__top-bar'>
                    <TopBar title={props.topBarTitle ?? props.title} toolbar={toolbar}/>
                </div>
            )}
            <div className='page__content-wrapper'>{props.children}</div>
        </div>
    );
};
