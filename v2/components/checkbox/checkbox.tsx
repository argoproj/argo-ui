import {faCheckSquare, faSquare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as React from 'react';

import './checkbox.scss';

export const Checkbox = (props: {value?: boolean; onChange?: (value: boolean) => void; style?: React.CSSProperties | any}) => {
    const [value, setValue] = React.useState<boolean>(props.value);

    const syncValue = (val: boolean) => {
        setValue(val);
        if (props.onChange) {
            props.onChange(val);
        }
    };

    React.useEffect(() => {
        syncValue(props.value);
    }, [props.value]);

    return (
        <div
            className={`checkbox ${value ? 'checkbox--selected' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                syncValue(!value);
            }}
            style={props.style}>
            <FontAwesomeIcon icon={value ? faCheckSquare : faSquare} />
        </div>
    );
};

export interface CheckboxOption {
    label: string;
    count?: number;
    icon?: React.ReactNode;
}

export const CheckboxRow = (props: {value: boolean; onChange?: (value: boolean) => void; option: CheckboxOption}) => {
    const [value, setValue] = React.useState(props.value);

    React.useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    return (
        <div className={`checkbox__item ${value ? 'checkbox__item--selected' : ''}`} onClick={() => setValue(!value)}>
            <Checkbox
                onChange={(val) => {
                    setValue(val);
                    props.onChange(val);
                }}
                value={value}
                style={{
                    marginRight: '8px',
                }}
            />
            {props.option.icon && <div style={{marginRight: '5px'}}>{props.option.icon}</div>}
            <div className='checkbox__item__label'>{props.option.label}</div>
            <div style={{marginLeft: 'auto'}}>{props.option.count}</div>
        </div>
    );
};
