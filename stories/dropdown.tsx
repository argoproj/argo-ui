import * as React from 'react';

import { DropDown } from '../src/components/dropdown/dropdown';
import { DropDownMenu } from '../src/components/dropdown-menu';

export default {
    title: 'Dropdown',
};

export const Default = () => (<DropDown anchor={() => <a>Click me</a>}><p>Dropdown content here</p></DropDown>);
Default.story = {
    name: 'default',
};

export const Menu = () => (
    <DropDown isMenu={true} anchor={() => <a>Click me</a>}>
        <ul>
            <li><a>menu item 1</a></li>
            <li><a>menu item 2</a></li>
        </ul>
    </DropDown>
);
Menu.story = {
  name: 'menu',
};

export const MenuWrapper = () => (
    <DropDownMenu anchor={() => <a>Click me</a>} items={[{
        title: 'menu item 1',
        action: () => window.alert('Clicked!'),
    }]} />
);
MenuWrapper.story = {
    name: 'menu wrapper',
};
