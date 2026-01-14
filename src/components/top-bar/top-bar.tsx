import {default as classNames} from 'classnames';
import * as React from 'react';

import { Link } from 'react-router-dom';

import { Checkbox } from '../checkbox';
import { DropDown } from '../dropdown/dropdown';
import { SplitButton, SplitButtonAction } from '../split-button/split-button';

require('./top-bar.scss');

export interface TopBarFilter<T> {
    items: Array<{ label?: string; value?: T; content?: ( changeSelection: (selectedValues: T[]) => any ) => React.ReactNode }>;
    selectedValues: T[];
    selectionChanged: (selectedValues: T[]) => any;
}

export interface ActionMenu {
    className?: string;
    items: {
        action: () => any;
        title: string | React.ReactElement;
        iconClassName?: string;
        qeId?: string;
        disabled?: boolean;
        /** Optional sub-actions - when provided, renders as a split button */
        subActions?: SplitButtonAction[];
    }[];
}

export interface Toolbar {
    filter?: TopBarFilter<any>;
    breadcrumbs?: { title: string | React.ReactNode, path?: string; }[];
    tools?: React.ReactNode;
    actionMenu?: ActionMenu;
}

export interface TopBarProps extends React.Props<any> {
    title: string;
    toolbar?: Toolbar;
}

const FilterDropdown = ({filter}: {filter: TopBarFilter<any>}) => (
    <DropDown isMenu={true}
            anchor={() => (
                <div className={classNames('top-bar__filter', { 'top-bar__filter--selected': filter.selectedValues.length > 0 })} title='Filter'>
                    <i className='argo-icon-filter' aria-hidden='true'/>
                    <i className='fa fa-angle-down' aria-hidden='true'/>
                </div>)}>
        <ul>
        {filter.items.map((item, i) => (
            <li key={i} className={classNames({'top-bar__filter-item': !item.content})}>
                {item.content && item.content((vals) => filter.selectionChanged(vals)) || (
                    <React.Fragment>
                        <Checkbox id={`filter__${item.value}`} checked={filter.selectedValues.includes(item.value)} onChange={(checked) => {
                            const selectedValues = filter.selectedValues.slice();
                            const index = selectedValues.indexOf(item.value);
                            if (index > -1 && !checked) {
                                selectedValues.splice(index, 1);
                            } else {
                                selectedValues.push(item.value);
                            }
                            filter.selectionChanged(selectedValues);
                        }} />
                        <label htmlFor={`filter__${item.value}`}>{item.label}</label>
                    </React.Fragment>
                )}
            </li>
        ))}
        </ul>
    </DropDown>
);

const renderBreadcrumbs = (breadcrumbs: { title: string | React.ReactNode, path?: string; }[]) => (
    <div className='top-bar__breadcrumbs'>
        {(breadcrumbs || []).map((breadcrumb, i) => {
            const nodes = [];
            if (i === breadcrumbs.length - 1) {
                nodes.push(<span key={i} className='top-bar__breadcrumbs-last-item'>{breadcrumb.title}</span>);
            } else {
                nodes.push(<Link key={i} to={breadcrumb.path}> {breadcrumb.title} </Link>);
            }
            if (i < breadcrumbs.length - 1) {
                nodes.push(<span key={`${i}_sep`} className='top-bar__sep'/>);
            }
            return nodes;
        })}
    </div>
);

const renderActionMenu = (actionMenu: ActionMenu) => (
    <div className='top-bar__action-menu'>
        {actionMenu.items.map((item, i) =>
            item.subActions && item.subActions.length > 0 ? (
                <SplitButton
                    key={i}
                    action={item.action}
                    title={item.title}
                    iconClassName={item.iconClassName}
                    subActions={item.subActions}
                    disabled={item.disabled}
                    qeId={item.qeId}
                />
            ) : (
                <button
                    disabled={!!item.disabled}
                    qe-id={item.qeId}
                    className='argo-button argo-button--base'
                    onClick={() => item.action()}
                    key={i}
                >
                    {item.iconClassName && (
                        <i className={item.iconClassName} style={{ marginLeft: '-5px', marginRight: '5px' }} />
                    )}
                    {item.title}
                </button>
            )
        )}
    </div>
);

const renderToolbar = (toolbar: Toolbar) => (
    <div className='top-bar row' key='tool-bar'>
        <div className='columns small-9 top-bar__left-side'>
            {toolbar.actionMenu && renderActionMenu(toolbar.actionMenu)}
        </div>
        <div className='columns small-3 top-bar__right-side'>
            {toolbar.filter && <FilterDropdown filter={toolbar.filter} />}
            {toolbar.tools}
        </div>
    </div>
);

export const TopBar = (props: TopBarProps) => (
    <div>
        <div className='top-bar' key='top-bar'>
            <div className='row'>
                <div className='columns top-bar__left-side'>
                    {props.toolbar && props.toolbar.breadcrumbs && renderBreadcrumbs(props.toolbar.breadcrumbs)}
                </div>
                <div className='top-bar__title text-truncate top-bar__right-side'>{props.title}</div>
            </div>
        </div>
        {props.toolbar && renderToolbar(props.toolbar)}
    </div>
);
