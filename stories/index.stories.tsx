import * as React from 'react';

import { storiesOf } from '@storybook/react';

import { DropDown } from '../src/app/shared/components';

storiesOf('Dropdown', module)
    .add('default', () => <DropDown anchor={() => <a>Click me</a>}><p>Dropdown content here</p></DropDown>)
    .add('menu', () => (
        <DropDown isMenu={true} anchor={() => <a>Click me</a>}>
            <ul>
                <li><a>menu item 1</a></li>
                <li><a>menu item 2</a></li>
            </ul>
        </DropDown>
    ));
