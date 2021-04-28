import * as React from 'react';
import {DocumentedComponent} from '../../types/documentation';
import ThemeDiv from '../theme-div/theme-div';

import './columns.scss';

export interface ColumnItem {
    name: string;
    children?: ColumnItem[];
    leaf?: React.ReactNode;
}

interface ColumnProps {
    items: ColumnItem[];
}

export class Columns extends DocumentedComponent<ColumnProps> {
    static docs = {
        name: 'Columns',
        description: 'A component for nested hierarchies, that will lay out data in a similar way to the macOS Finder Column view',
        props: [
            {
                name: 'items',
                type: 'ColumnItem[]',
                description: 'List of column items, that can each contain their own children column items for recursive structure',
            },
        ],
    };
    render = () => <_Columns {...this.props} />;
}

export const _Columns = (props: ColumnProps) => {
    const [selected, setSelected] = React.useState(-1);
    return (
        <div className='columns' style={{display: 'flex'}}>
            <ThemeDiv className='column'>
                {(props.items || []).map((item, i) => (
                    <div
                        key={`${item.name}`}
                        className={`column__item ${selected === i ? 'column__item--selected' : ''} ${item.children?.length > 0 || item.leaf ? '' : 'column__item--dead-end'}`}
                        onClick={() => setSelected(i)}>
                        {item.name}
                    </div>
                ))}
            </ThemeDiv>
            {selected > -1 && (
                <React.Fragment>
                    {props.items[selected].leaf ? (
                        <div style={{padding: '10px', width: '400px'}}>{props.items[selected].leaf}</div>
                    ) : props.items[selected].children?.length > 0 ? (
                        <Columns items={props.items[selected].children} />
                    ) : (
                        <div className='column' />
                    )}
                </React.Fragment>
            )}
        </div>
    );
};
