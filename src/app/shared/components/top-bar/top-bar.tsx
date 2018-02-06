import * as classNames from 'classnames';
import * as React from 'react';

import { Checkbox } from '../checkbox';
import { DropDown } from '../dropdown/dropdown';

require('./top-bar.scss');

export interface TopBarFilter<T> {
    items: Array<{ label: string; value: T; }>;
    selectedValues: T[];
    selectionChanged: (selectedValues: T[]) => any;
}

export interface TopBarProps extends React.Props<any> {
    title: string;
    filter?: TopBarFilter<any>;
}

export const TopBar = (props: TopBarProps) => (
    <div>
        <div className='top-bar' key='top-bar'>
            <div className='row'>
                <div className='columns small-9 top-bar__left-side'>
                    <div className='top-bar__title text-truncate'>{props.title}</div>
                </div>
                <div className='columns small-3 top-bar__right-side'>
                    <div className='top-bar__tools'/>
                </div>
            </div>
        </div>
        {props.filter && (
            <div className='top-bar row' key='tool-bar'>
                <div className='top-bar__right-side columns small-3 small-offset-9'>
                    <DropDown isMenu={true} anchor={() => (
                        <div className={classNames('top-bar__filter', { 'top-bar__filter--selected': props.filter.selectedValues.length > 0 })}>
                            <i className='argo-icon-filter' aria-hidden='true'/>
                            <i className='fa fa-angle-down' aria-hidden='true'/>
                        </div>
                    )}>
                        <ul>
                        {props.filter.items.map((item) => (
                            <li key={item.value}>
                                <Checkbox id={`filter__${item.value}`} checked={props.filter.selectedValues.includes(item.value)} onChange={(checked) => {
                                    const selectedValues = props.filter.selectedValues.slice();
                                    const index = selectedValues.indexOf(item.value);
                                    if (index > -1 && !checked) {
                                        selectedValues.splice(index, 1);
                                    } else {
                                        selectedValues.push(item.value);
                                    }
                                    props.filter.selectionChanged(selectedValues);
                                }} />
                                <label htmlFor={`filter__${item.value}`}>{item.label}</label>
                            </li>
                        ))}
                        </ul>
                    </DropDown>
                </div>
            </div>
        )}
    </div>
);
