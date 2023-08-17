import * as React from 'react';
import Text from '../text/text';
import {Tooltip} from './tooltip';

export default {
    component: Tooltip,
    title: 'Components/Tooltip',
};

export const Primary = (args: any) => {
    return (
        <div style={{padding:'1em', width: 'fit-content'}}>
            <Tooltip {...args} content={<Text>{args.content}</Text>}>
                <Text>Hover over me!</Text>
            </Tooltip>
        </div>
    );
};

Primary.args = {
    content: 'Hello there!',
};
