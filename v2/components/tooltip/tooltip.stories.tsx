import * as React from 'react';
import Text from '../text/text';
import {Tooltip} from './tooltip';

export default {
    component: Tooltip,
    title: 'Components/Tooltip',
};

export const Primary = (args: any) => {
    return (
        <Tooltip {...args} content={<Text>{args.content}</Text>}>
            <Text>Hover over me!</Text>
        </Tooltip>
    );
};

Primary.args = {
    content: 'Hello there!',
};
