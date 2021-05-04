import * as React from 'react';
import {DocumentedComponent} from '../../types/documentation';
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

export class Alert extends DocumentedComponent<AlertProps> {
    static docs = {
        name: 'Alert',
        description: 'Display important information to users',
        props: [
            {name: 'style', type: 'React.CSSProperties', description: 'CSS Styles'},
            {name: 'type', type: '"error" | "warning" | "success"', description: 'The type of alert. This helps determine the style of the alert'},
        ],
    };
    render = () => <_Alert {...this.props} />;
}

export const _Alert = (props: AlertProps) => {
    return (
        <ThemeDiv style={props.style} className={`alert alert--${props.type}`}>
            {props.children}
        </ThemeDiv>
    );
};

export default Alert;
