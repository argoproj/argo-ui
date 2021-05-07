import {faCheck, faCircleNotch, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Key, useKeyListener} from 'react-keyhooks';
import * as React from 'react';
import {useClickOutside, useTimeout} from '../../utils/utils';
import {EffectDiv} from '../effect-div/effect-div';
import {Tooltip} from '../tooltip/tooltip';

import './action-button.scss';
import {Theme} from '../theme-div/theme-div';

export interface ActionButtonProps {
    action?: Function;
    label?: string;
    icon?: IconDefinition;
    indicateLoading?: boolean;
    dark?: boolean;
    theme?: Theme;
    disabled?: boolean;
    short?: boolean;
    style?: React.CSSProperties;
    tooltip?: React.ReactNode;
    shouldConfirm?: boolean;
    indicateSuccess?: boolean;
}

/**
 * Provide users with clickable buttons to perform an action
 */
export const ActionButton = (props: ActionButtonProps) => {
    const {label, action, icon, indicateLoading, short, shouldConfirm} = props;
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [confirmed, confirm] = React.useState(false);
    const [displayLabel, setDisplayLabel] = React.useState(label);
    const [displayIcon, setDisplayIcon] = React.useState(icon);
    const ref = React.useRef(null);

    React.useEffect(() => {
        setDisplayIcon(props.icon);
        setDisplayLabel(props.label);
    }, [props.icon, props.label]);

    const unconfirm = React.useCallback(() => {
        if (props.shouldConfirm) {
            setDisplayIcon(icon);
            setDisplayLabel(label);
            confirm(false);
        }
    }, [icon, label, props.shouldConfirm]);
    useClickOutside(ref, unconfirm);

    useTimeout(() => setLoading(false), 1000, [loading]);
    useTimeout(() => setSuccess(false), indicateLoading ? 1000 + 500 : 500, [success]);

    const listen = useKeyListener();
    listen(Key.ESCAPE, () => {
        unconfirm();
        return confirmed;
    });

    const getIcon = () => {
        if (loading && indicateLoading) {
            return faCircleNotch;
        } else if (success && props.indicateSuccess) {
            return faCheck;
        } else {
            return displayIcon;
        }
    };
    const button = (
        <EffectDiv
            className={`action-button ${props.disabled ? 'action-button--disabled' : ''} ${confirmed ? 'action-button--selected' : ''}`}
            style={props.style}
            innerref={ref}
            theme={props.theme || (props.dark && Theme.Dark) || Theme.Light}
            onClick={(e) => {
                if (props.disabled) {
                    e.preventDefault();
                    return;
                }
                if (shouldConfirm) {
                    if (!confirmed) {
                        setDisplayLabel('SURE?');
                        setDisplayIcon(faCheck);
                        confirm(true);
                        e.preventDefault();
                        return;
                    } else {
                        confirm(false);
                        setDisplayLabel(props.label);
                        setDisplayIcon(props.icon);
                    }
                }
                if (action && (shouldConfirm ? confirmed : true)) {
                    action();
                    setLoading(true);
                    setSuccess(true);
                    e.preventDefault();
                }
            }}>
            {icon && <FontAwesomeIcon icon={getIcon()} spin={loading && indicateLoading} />}
            {label && (!icon || !short) && <span style={icon && {marginLeft: '5px'}}>{displayLabel}</span>}
        </EffectDiv>
    );
    return props.tooltip ? <Tooltip content={props.tooltip}>{button}</Tooltip> : button;
};

export default ActionButton;
