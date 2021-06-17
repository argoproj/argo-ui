import * as React from 'react';
import ThemeDiv from '../theme-div/theme-div';

import './alert.scss';

export enum AlertType {
    Error = 'error',
    Warning = 'warning',
    Success = 'success',
}

interface AlertProps {
    children: string | string[];
    type: AlertType;
    style?: React.CSSProperties;
}

/**
 * Displays important information in a colored banner
 */
export const Alert = (props: AlertProps) => {
    return (
        <ThemeDiv style={props.style} className={`alert alert--${props.type}`}>
            {props.children}
        </ThemeDiv>
    );
};

export default Alert;
