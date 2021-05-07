import * as React from 'react';
import ThemeDiv, {Theme} from '../theme-div/theme-div';

import './text.scss';

/**
 * Themes children according to Theme Context, and styles them with appropriate font.
 */
export const Text = (props: {children: string | string[] | React.ReactNode; dark?: boolean; theme?: Theme}) => {
    return (
        <ThemeDiv className='text' theme={props.theme || (props.dark && Theme.Dark) || Theme.Light}>
            {props.children}
        </ThemeDiv>
    );
};

export default Text;
