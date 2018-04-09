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

export class DropDownMenu extends React.PureComponent<DropDownMenuProps> {

    private dropdown: DropDown;

    public render() {
        return (
            <DropDown anchor={this.props.anchor} isMenu={true} ref={(dropdown: any) => this.dropdown = dropdown}>
                <ul>
                    {this.props.items.map((item) => <li
                        className={item.className}
                        onClick={(event) => this.onItemClick(item, event)} key={item.title}>{item.title}</li>)}
                </ul>
            </DropDown>
        );
    }

    private onItemClick(item: MenuItem, event: any) {
        item.action();
        event.stopPropagation();
        if (this.dropdown) {
            this.dropdown.close();
        }
    }
}
