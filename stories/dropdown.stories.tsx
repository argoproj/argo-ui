import * as React from 'react';

import { DropDown } from '../src/components/dropdown/dropdown';
import { DropDownMenu } from '../src/components/dropdown-menu';

export default {
    title: 'Dropdown',
};

export const Default = () => {
    const anchorRef = React.useRef<HTMLAnchorElement>(null);
    const dropdownRef = React.useRef<DropDown>(null);
    return (
        <>
            <a ref={anchorRef} onClick={() => dropdownRef.current?.open()} style={{cursor: 'pointer'}}>Click me</a>
            <DropDown ref={dropdownRef} anchor={anchorRef}><p>Dropdown content here</p></DropDown>
        </>
    );
};
Default.storyName = 'default';

export const Menu = () => {
    const anchorRef = React.useRef<HTMLAnchorElement>(null);
    const dropdownRef = React.useRef<DropDown>(null);
    return (
        <>
            <a ref={anchorRef} onClick={() => dropdownRef.current?.open()} style={{cursor: 'pointer'}}>Click me</a>
            <DropDown ref={dropdownRef} isMenu={true} anchor={anchorRef}>
                <ul>
                    <li><a>menu item 1</a></li>
                    <li><a>menu item 2</a></li>
                </ul>
            </DropDown>
        </>
    );
}
Menu.storyName = 'menu';

export const MenuWrapper = () => {
    return (
        <DropDownMenu anchor={() => <a>Click me</a>} items={[{
            title: 'menu item 1',
            action: () => window.alert('Clicked!'),
        }]} />
    );
}
MenuWrapper.storyName = 'menu wrapper';
