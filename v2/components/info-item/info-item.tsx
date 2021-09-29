import * as React from 'react';
import Text from '../text/text';
import {ThemeDiv} from '../theme-div/theme-div';
import {Tooltip} from '../tooltip/tooltip';
import './info-item.scss';

export enum InfoItemKind {
    Default = 'default',
    Colored = 'colored',
    Monospace = 'monospace',
    Canary = 'canary',
    BlueGreen = 'bluegreen',
}

export interface InfoItemProps {
    content?: string;
    icon?: string;
    style?: React.CSSProperties;
    kind?: InfoItemKind;
    truncate?: boolean;
    lightweight?: boolean;
}

/**
 * Displays a small piece encapsulated piece of data
 */
export const InfoItem = (props: InfoItemProps) => {
    const truncateStyle = props.truncate ? {overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'} : {};
    const item = (
        <ThemeDiv className={`info-item${props.kind ? ` info-item--${props.kind}` : ''} ${props.lightweight ? 'info-item--lightweight' : ''}`} style={props.style}>
            {props.icon && (
                <span style={props.content && {marginRight: '5px'}}>
                    <i className={`fa ${props.icon}`} />
                </span>
            )}
            <Text style={truncateStyle as React.CSSProperties}>{props.content}</Text>
        </ThemeDiv>
    );
    return props.truncate ? <Tooltip content={props.content}>{item}</Tooltip> : item;
};

/**
 * Displays a right justified InfoItem (or multiple InfoItems) and a left justfied label
 */
export const InfoItemRow = (props: {label: string | React.ReactNode; items?: InfoItemProps | InfoItemProps[]; lightweight?: boolean}) => {
    let {items} = props;
    const {label} = props;
    let itemComponents = null;
    if (!Array.isArray(items)) {
        items = [items];
    }
    itemComponents = items?.map((c, i) => <InfoItem key={`${c} ${i}`} {...c} lightweight={c?.lightweight === undefined ? props.lightweight : c?.lightweight} />);

    return (
        <div className='info-item--row'>
            {props.label && (
                <Text>
                    <label>{label}</label>
                </Text>
            )}
            {props.items && <div className='info-item--row__container'>{itemComponents}</div>}
        </div>
    );
};
