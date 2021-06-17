import * as React from 'react';
import Text from '../text/text';
import {EffectDiv} from './effect-div';

export default {
    component: EffectDiv,
    title: 'Components/EffectDiv',
};

export const Primary = (args: any) => {
    return (
        <EffectDiv {...args}>
            <Text>Hello there!</Text>
        </EffectDiv>
    );
};
