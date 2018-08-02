import * as classNames from 'classnames';
import * as React from 'react';

import { Link } from 'react-router-dom';

import { Checkbox } from '../checkbox';
import { DropDownMenu } from '../dropdown-menu';
import { DropDown } from '../dropdown/dropdown';

require('./top-bar.scss');

export interface TopBarFilter<T> {
    items: Array<{ label: string; value: T; }>;
    selectedValues: T[];
    selectionChanged: (selectedValues: T[]) => any;
}

export interface ActionMenu {
    className?: string;
    items: {
        action: () => any;
        title: string;
        iconClassName?: string;
    }[];
}

export interface Toolbar {
    filter?: TopBarFilter<any>;
    breadcrumbs?: { title: string, path?: string; }[];
    tools?: React.ReactNode;
    actionMenu?: ActionMenu;
}

export interface TopBarProps extends React.Props<any> {
    title: string;
    toolbar?: Toolbar;
}

const renderFilter = (filter: TopBarFilter<any>) => (
    <DropDown isMenu={true}
            anchor={() => (
                <div className={classNames('top-bar__filter', { 'top-bar__filter--selected': filter.selectedValues.length > 0 })}>
                    <i className='argo-icon-filter' aria-hidden='true'/>
                    <i className='fa fa-angle-down' aria-hidden='true'/>
                </div>)}>
        <ul>
        {filter.items.map((item) => (
            <li key={item.value}>
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
            </li>
        ))}
        </ul>
    </DropDown>
);

const renderBreadcrumbs = (breadcrumbs: { title: string, path?: string; }[]) => (
    <div className='top-bar__breadcrumbs'>
        {(breadcrumbs || []).map((breadcrumb, i) => {
            const nodes = [];
            if (i === breadcrumbs.length - 1) {
                nodes.push(<span key={breadcrumb.title} className='top-bar__breadcrumbs-last-item'>{breadcrumb.title}</span>);
            } else {
                nodes.push(<Link key={breadcrumb.title} to={breadcrumb.path}> {breadcrumb.title} </Link>);
            }
            if (i < breadcrumbs.length - 1) {
                nodes.push(<span key={`${breadcrumb.title}_sep`} className='top-bar__sep'/>);
            }
            return nodes;
        })}
    </div>
);

const renderActionMenu = (actionMenu: ActionMenu) => (
    <div className='top-bar__action-menu'>
        <DropDownMenu items={actionMenu.items} anchor={() => (
            <a className='argo-button argo-button--radius argo-button--has-icon'>
                <i aria-hidden='true' className={actionMenu.className || 'fa fa-ellipsis-v'}/>
            </a>)}
        />
    </div>
);

const renderToolbar = (toolbar: Toolbar) => (
    <div className='top-bar row' key='tool-bar'>
        <div className='top-bar__left-side columns small-9'>
            {toolbar.breadcrumbs && renderBreadcrumbs(toolbar.breadcrumbs)}
        </div>
        <div className='columns small-3'>
            {toolbar.actionMenu && renderActionMenu(toolbar.actionMenu)}
            <div className='top-bar__right-side '>
                {toolbar.tools}
                {toolbar.filter && renderFilter(toolbar.filter)}
            </div>
        </div>
    </div>
);

export const TopBar = (props: TopBarProps) => (
    <div>
        <div className='top-bar' key='top-bar'>
            <div className='row'>
                <div className='columns small-9 top-bar__left-side'>
                    <div className='top-bar__title text-truncate'>{props.title}</div>
                </div>
            </div>
        </div>
        {props.toolbar && renderToolbar(props.toolbar)}
    </div>
);
