import * as React from 'react';
import {ThemeDiv} from '../theme-div/theme-div';

import './input.scss';

export interface InputProps {
    value: string;
    ref: React.MutableRefObject<HTMLInputElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type SetInputFxn = (val: string) => void;
export const FormResetFactory = (setFxns: SetInputFxn[]) => {
    return () => {
        setFxns.forEach((reset) => reset(''));
    };
};

export const useInput = (init: string, callback?: (val: string) => void): [string, SetInputFxn, InputProps] => {
    const [state, setState] = React.useState(init);
    const inputRef = React.useRef(null);

    const InputP: InputProps = {
        value: state,
        ref: inputRef,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setState(e.target.value);
            if (callback) {
                callback(e.target.value);
            }
        },
    };

    return [state, setState, InputP];
};

export const useDebounce = (value: string, debouncems: number): string => {
    const [val, setVal] = React.useState(value);

    React.useEffect(() => {
        const to = setTimeout(() => {
            setVal(value);
        }, debouncems);
        return () => clearInterval(to);
    }, [value, debouncems]);

    return val;
};

/**
 * A formatted field, accompanied by the `useInput` hook. `useInput` returns a `[data, setData, props]` thruple, where `data` and `setData` are analagous to `React.useState`,
 * and `props` are designed to be included in the Input component with a spread operator: `<Input YOUR_PROPS_HERE {...props} />`
 */
export const Input = (props: React.InputHTMLAttributes<HTMLInputElement> & {innerref?: React.MutableRefObject<any>}) => (
    <ThemeDiv className='input-container'>
        <input {...(props as any)} className={props.className ? `${props.className} input` : 'input'} ref={props.innerref} />
    </ThemeDiv>
);
