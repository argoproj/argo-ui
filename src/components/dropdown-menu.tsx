import * as React from 'react';
import { DropDown } from './dropdown/dropdown';

export interface MenuItem {
    title: string | React.ReactElement;
    iconClassName?: string;
    action: () => any;
}

export interface DropDownMenuProps {
    items: MenuItem[];
    anchor: React.ComponentType;
    qeId?: string;
}

export class DropDownMenu extends React.PureComponent<DropDownMenuProps> {

    private dropdown: DropDown;

    public render() {
        return (
            <DropDown anchor={this.props.anchor} isMenu={true} ref={(dropdown: any) => this.dropdown = dropdown} qeId={this.props.qeId}>
                <ul>
                    {this.props.items.map((item, i) => <li key={i} qe-id={this.props.qeId + `-` + item.title}
                        onClick={(event) => this.onItemClick(item, event)}>
                        <a href="#" style={{ textDecoration: 'none', color: 'inherit' }} onClick={(e) => { e.preventDefault(); }}>
                            {item.iconClassName && <i className={item.iconClassName} />} {item.title}
                        </a>
                    </li>
                    )}
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
