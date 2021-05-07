import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as React from 'react';
import Text from '../text/text';
import {ThemeDiv} from '../theme-div/theme-div';
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
    icon?: IconDefinition;
    style?: React.CSSProperties;
    kind?: InfoItemKind;
}

/**
 * Displays a small piece encapsulated piece of data
 */
export const InfoItem = (props: InfoItemProps) => (
    <ThemeDiv className={`info-item${props.kind ? ` info-item--${props.kind}` : ''}`} style={props.style}>
        {props.icon && (
            <span style={props.content && {marginRight: '5px'}}>
                <FontAwesomeIcon icon={props.icon} />
            </span>
        )}
        <Text>{props.content}</Text>
    </ThemeDiv>
);

/**
 * Displays a right justified InfoItem (or multiple InfoItems) and a left justfied label
 */
export const InfoItemRow = (props: {label: string | React.ReactNode; items?: InfoItemProps | InfoItemProps[]}) => {
    let {label, items} = props;
    let itemComponents = null;
    if (!Array.isArray(items)) {
        items = [items];
    }
    itemComponents = items.map((c, i) => <InfoItem key={`${c} ${i}`} {...c} />);

    return (
        <div className='info-item--row'>
            {props.label && (
                <Text>
                    <label>{label}</label>
                </Text>
            )}
            {props.items && <div style={{marginLeft: 'auto', display: 'flex'}}>{itemComponents}</div>}
        </div>
    );
};
