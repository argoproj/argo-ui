import * as React from 'react';
import {Text} from './text';

export default {
    component: Text,
    title: 'Components/Text',
    argTypes: {
        children: {control: {type: 'text'}},
        dark: {description: 'Light colored text when true. Corresponds to the theme, not the color of the text.'},
        theme: {description: 'Same logic as `dark`, but takes precendence over `dark` when set'},
    },
};

export const Primary = (args: any) => <Text {...args}>{args.children}</Text>;
Primary.args = {children: 'Hello world'};
