import * as React from 'react';
import {DropDown, DropDownHandle} from '../dropdown/dropdown';

require('./split-button.scss');

export interface SplitButtonAction {
    title: string | React.ReactElement;
    action: () => any;
    iconClassName?: string;
}

export interface SplitButtonProps {
    /** Main button action */
    action?: () => any;
    /** Main button title */
    title: string | React.ReactElement;
    /** Optional icon class for main button */
    iconClassName?: string;
    /** Sub-actions shown in dropdown menu */
    subActions: SplitButtonAction[];
    /** Whether the button is disabled */
    disabled?: boolean;
    /** QE test ID */
    qeId?: string;
}

/**
 * A split button component with a primary action and a dropdown menu for sub-actions.
 * The primary button triggers the main action, while the dropdown arrow reveals additional options.
 */
export const SplitButton = (props: SplitButtonProps) => {
    const {action, title, iconClassName, subActions, disabled, qeId} = props;
    const dropdownRef = React.useRef<DropDownHandle>(null);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    return (
        <div className={`argo-split-button ${disabled ? 'argo-split-button--disabled' : ''}`}>
            <button
                ref={anchorRef}
                disabled={disabled}
                qe-id={qeId}
                className='argo-split-button__primary'
                onClick={() => {
                    if (!disabled && action) {
                        action();
                    }
                }}
            >
                {iconClassName && (
                    <i className={iconClassName} />
                )}
                <span className='argo-split-button__label'>{title}</span>
            </button>
            <button
                disabled={disabled}
                className='argo-split-button__toggle'
                qe-id={qeId ? `${qeId}-toggle` : undefined}
                onClick={() => {
                    dropdownRef.current?.open()
                    console.log('SplitButton: Toggle dropdown menu');
                    console.log(`ref: ${anchorRef.current}`);
                }}
            >
                <i className='fa fa-caret-down' />
            </button>
                <DropDown
                    ref={dropdownRef}
                    isMenu={true}
                    anchor={anchorRef}
                    qeId={qeId ? `${qeId}-dropdown` : undefined}
                >
                <ul>
                    {(subActions || []).map((subAction, i) => (
                        <li
                            key={i}
                            qe-id={qeId ? `${qeId}-${i}` : undefined}
                            onClick={(e) => {
                                if (subAction.action) {
                                    subAction.action();
                                }
                                dropdownRef.current?.close();
                                e.stopPropagation();
                            }}
                        >
                            {subAction.iconClassName && <i className={subAction.iconClassName} />}{' '}
                            {subAction.title}
                        </li>
                    ))}
                </ul>
                </DropDown>
        </div>
    );
};

export default SplitButton;
