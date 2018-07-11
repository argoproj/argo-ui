import * as React from 'react';

export const Checkbox = (props: {
        disabled?: boolean,
        checked?: boolean,
        onChange?: (val: boolean) => any,
        id?: string,
    }) => (
    <span className='argo-checkbox'>
        <input id={props.id} type='checkbox' disabled={props.disabled} checked={props.checked} onChange={() => props.onChange && props.onChange(!props.checked)}/>
        <span><i className='fa fa-check'/></span>
    </span>
);
