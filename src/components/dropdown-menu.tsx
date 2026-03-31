import * as React from 'react';
import { AnchoredDropdown, AnchoredDropdownHandle } from './dropdown/anchored-dropdown';

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

    private dropdown: AnchoredDropdownHandle | null = null;
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
                <AnchoredDropdown anchor={this.anchorRef} isMenu={true} ref={(dropdown) => { this.dropdown = dropdown; }}>
                    <ul>
                        {this.props.items.map((item, i) => <li qe-id={this.props.qeId + `-` + item.title}
                            onClick={(event) => this.onItemClick(item, event)} key={i}>
                            {item.iconClassName && <i className={item.iconClassName}/>} {item.title}
                            </li>)}
                    </ul>
                </AnchoredDropdown>
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
