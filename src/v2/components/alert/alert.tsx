import * as React from 'react';
import ThemeDiv from '../theme-div/theme-div';

import './alert.scss';

export enum AlertType {
    Error = 'error',
    Warning = 'warning',
    Success = 'success',
}

export const Alert = (props: {children: string | string[]; type: AlertType}) => {
    return <ThemeDiv className={`alert alert--${props.type}`}>{props.children}</ThemeDiv>;
};

export default Alert;
