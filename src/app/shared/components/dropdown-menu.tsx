import * as React from 'react';
import { DropDown } from './dropdown/dropdown';

export interface MenuItem {
    title: string;
    className?: string;
    action: () => any;
}

export interface DropDownMenuProps {
    items: MenuItem[];
    anchor: React.ComponentType;
}

export const DropDownMenu = (props: DropDownMenuProps) => (
    <DropDown anchor={props.anchor} isMenu={true}>
        <ul>
            {props.items.map((item) => <li className={item.className} onClick={() => item.action()} key={item.title}>{item.title}</li>)}
        </ul>
    </DropDown>
);
