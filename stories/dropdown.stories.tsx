import * as React from 'react';

import { DropDown } from '../src/components/dropdown/dropdown';
import { DropDownMenu } from '../src/components/dropdown-menu';

export default {
    title: 'Dropdown',
};

export const Default = () => (<DropDown anchor={() => <a>Click me</a>}><p>Dropdown content here</p></DropDown>);
Default.storyName = 'default';

export const Menu = () => {
    return (
        <DropDown isMenu={true} anchor={() => <a>Click me</a>}>
            <ul>
                <li><a>menu item 1</a></li>
                <li><a>menu item 2</a></li>
            </ul>
        </DropDown>
    );
};
Menu.storyName = 'menu';

export const MenuWrapper = () => {
    return (
        <DropDownMenu anchor={() => <a>Click me</a>} items={[{
            title: 'menu item 1',
            action: () => window.alert('Clicked!'),
        }]} />
    );
};
MenuWrapper.storyName = 'menu wrapper';
