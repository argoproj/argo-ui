import {faCheck, faCircleNotch, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Key, useKeyListener} from 'react-keyhooks';
import * as React from 'react';
import {useClickOutside} from '../../utils/utils';
import {EffectDiv} from '../effect-div/effect-div';
import {Tooltip} from '../tooltip/tooltip';

import './action-button.scss';
import {DocumentedComponent, PropDoc} from '../../types/documentation';

export class ActionButton extends DocumentedComponent<ActionButtonProps> {
    static docs = {
        name: 'ActionButton',
        props: [
            {
                name: 'action',
                type: 'Function',
                description: 'What do you want this button to do when clicked?',
            },
            {
                name: 'label',
                type: 'string',
                description: 'The text shown in the button',
            },
            {
                name: 'icon',
                type: 'IconDefinition',
                description: 'Icon shown on left side of text, or centered if no text. Should be faSomething',
            },
            {
                name: 'indicateLoading',
                type: 'boolean',
                description: 'If set, buttons icon (if exists) is briefly replaced with spinner after clicking',
            },
            {
                name: 'dark',
                type: 'boolean',
                description: 'If set, button is always dark',
            },
            {
                name: 'disabled',
                type: 'boolean',
                description: 'If set, button is, and appears, unclickable',
            },
            {
                name: 'short',
                type: 'boolean',
                description: 'If set, button only displays icon (no label)',
            },
            {
                name: 'style',
                type: 'React.CSSProperties',
                description: 'CSS styles',
            },
            {
                name: 'tooltip',
                type: 'React.ReactNode',
                description: 'If set, a tooltip is shown on hover with this content',
            },
            {
                name: 'shouldConfirm',
                type: 'boolean',
                description: 'If set, user must confirm action by clicking again, after clicking the first time',
            },
        ] as PropDoc[],
        description: 'ActionButtons are for providing users with clickable areas to perform an action',
    };
    render = () => <_ActionButton {...this.props} />;
}

export interface ActionButtonProps {
    action?: Function;
    label?: string;
    icon?: IconDefinition;
    indicateLoading?: boolean;
    dark?: boolean;
    disabled?: boolean;
    short?: boolean;
    style?: React.CSSProperties;
    tooltip?: React.ReactNode;
    shouldConfirm?: boolean;
}

export const _ActionButton = (props: ActionButtonProps) => {
    const {label, action, icon, indicateLoading, short, shouldConfirm} = props;
    const [loading, setLoading] = React.useState(false);
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
    React.useEffect(() => {
        const to = setTimeout(() => setLoading(false), 1000);
        return () => clearInterval(to);
    }, [loading]);

    const listen = useKeyListener();
    listen(Key.ESCAPE, () => {
        unconfirm();
        return confirmed;
    });
    const button = (
        <EffectDiv
            className={`action-button ${props.dark ? 'action-button--dark' : ''} ${props.disabled ? 'action-button--disabled' : ''} ${confirmed ? 'action-button--selected' : ''}`}
            style={props.style}
            innerref={ref}
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
                    e.preventDefault();
                }
            }}>
            {icon && <FontAwesomeIcon icon={loading && indicateLoading ? faCircleNotch : displayIcon} spin={loading && indicateLoading} />}
            {label && !short && <span style={icon && {marginLeft: '5px'}}>{displayLabel}</span>}
        </EffectDiv>
    );
    return props.tooltip ? <Tooltip content={props.tooltip}>{button}</Tooltip> : button;
};

export default ActionButton;
