import * as React from 'react';
import { DropDown, DropDownHandle } from './dropdown/dropdown';

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

    private dropdown: DropDownHandle | null = null;
    private anchorRef = React.createRef<HTMLDivElement>();

    public render() {
        const Anchor = this.props.anchor;
        return (
            <>
                <div
                    ref={this.anchorRef}
                    className='argo-dropdown-menu__anchor'
                    style={{display: 'inline-block', cursor: 'pointer'}}
                    qe-id={this.props.qeId}
                    onClick={(event) => { this.dropdown?.open(); event.stopPropagation(); }}
                >
                    <Anchor />
                </div>
                <DropDown anchor={this.anchorRef} isMenu={true} ref={(dropdown) => this.dropdown = dropdown}>
                    <ul>
                        {this.props.items.map((item, i) => <li qe-id={this.props.qeId + `-` + item.title}
                            onClick={(event) => this.onItemClick(item, event)} key={i}>
                            {item.iconClassName && <i className={item.iconClassName}/>} {item.title}
                            </li>)}
                    </ul>
                </DropDown>
            </>
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
