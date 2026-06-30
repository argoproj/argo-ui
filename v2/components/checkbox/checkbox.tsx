import * as React from 'react';

import './checkbox.scss';

export const Checkbox = (props: {value?: boolean; onChange?: (value: boolean) => void; style?: React.CSSProperties | any}) => {
    const [value, setValue] = React.useState<boolean>(props.value);
    const [prevPropValue, setPrevPropValue] = React.useState<boolean>(props.value);

    // Sync local state with the controlling prop during render rather than in an
    // effect. This avoids a cascading render and keeps `value` derived from
    // `props.value` whenever the prop changes.
    if (props.value !== prevPropValue) {
        setPrevPropValue(props.value);
        setValue(props.value);
    }

    const syncValue = (val: boolean) => {
        setValue(val);
        if (props.onChange) {
            props.onChange(val);
        }
    };

    // Notify the parent of the current value on mount and whenever the
    // controlling prop changes. This mirrors the original effect, which called
    // onChange(props.value) on mount and on every props.value change.
    React.useEffect(() => {
        if (props.onChange) {
            props.onChange(props.value);
        }
    }, [props.value]);

    return (
        <div
            className={`checkbox ${value ? 'checkbox--selected' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                syncValue(!value);
            }}
            style={props.style}>
            <i className='fa fa-check' />
        </div>
    );
};
