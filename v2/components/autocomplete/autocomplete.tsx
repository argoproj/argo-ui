import {Key, KeybindingContext, useNav} from 'react-keyhooks';
import * as React from 'react';
import {Input, InputProps, SetInputFxn, useDebounce, useInput} from '../input/input';
import ThemeDiv from '../theme-div/theme-div';

import './autocomplete.scss';

interface AutocompleteProps extends InputProps {
    inputref?: React.MutableRefObject<HTMLInputElement>;
}

export const useAutocomplete = (init: string, callback?: (val: string) => void): [string, SetInputFxn, AutocompleteProps] => {
    const [state, setState, Input] = useInput(init);
    const Autocomplete = Input as AutocompleteProps;
    if (Autocomplete.ref) {
        Autocomplete.inputref = Input.ref;
        delete Autocomplete.ref;
    }
    return [state, setState, Autocomplete];
};

export const Autocomplete = (
    props: React.InputHTMLAttributes<HTMLInputElement> & {
        items: string[];
        inputStyle?: React.CSSProperties;
        onItemClick?: (item: string) => void;
        icon?: string;
        inputref?: React.MutableRefObject<HTMLInputElement>;
    }
) => {
    const [curItems, setCurItems] = React.useState(props.items || []);
    const nullInputRef = React.useRef<HTMLInputElement>(null);
    const inputRef = props.inputref || nullInputRef;
    const autocompleteRef = React.useRef(null);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [pos, nav, reset] = useNav(props.items.length);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        function unfocus(e: any) {
            if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', unfocus);
        return () => document.removeEventListener('mousedown', unfocus);
    }, [autocompleteRef]);

    const debouncedVal = useDebounce(props.value as string, 350);

    React.useEffect(() => {
        const filtered = (props.items || []).filter((i) => {
            return i.includes(debouncedVal);
        });
        setCurItems(filtered.length > 0 ? filtered : props.items);
    }, [debouncedVal, props.items]);

    const {useKeybinding} = React.useContext(KeybindingContext);
    useKeybinding(Key.TAB, (e) => {
        if (showSuggestions) {
            if (pos === curItems.length - 1) {
                reset();
            }
            nav(1);
            return true;
        }
        return false;
    });

    useKeybinding(Key.ESCAPE, (e) => {
        if (showSuggestions) {
            reset();
            setShowSuggestions(false);
            if (inputRef && inputRef.current) {
                inputRef.current.blur();
            }
            return true;
        }
        return false;
    });

    useKeybinding(Key.ENTER, () => {
        if (showSuggestions && props.onItemClick) {
            props.onItemClick(curItems[pos]);
            return true;
        }
        return false;
    });

    useKeybinding(Key.UP, () => {
        if (showSuggestions) {
            nav(-1);
            return false;
        }
        return true;
    });

    useKeybinding(Key.DOWN, () => {
        if (showSuggestions) {
            nav(1);
            return false;
        }
        return true;
    });

    const style = props.style;
    const trimmedProps = {...props};
    delete trimmedProps.style;
    delete trimmedProps.inputStyle;
    delete trimmedProps.onItemClick;

    const [inverted, setInverted] = React.useState(false);

    React.useEffect(() => {
        const listener = (event: any) => {
            if (autocompleteRef && autocompleteRef.current && menuRef.current && !(event.target === menuRef.current)) {
                const node = inputRef.current;
                if (node && menuRef.current) {
                    const rect = node.getBoundingClientRect();
                    const computedStyle = window.getComputedStyle(node);
                    const marginBottom = parseInt(computedStyle.marginBottom, 10) || 0;
                    let menuTop = rect.bottom + marginBottom;
                    if (window.innerHeight - (menuTop + menuRef.current.offsetHeight) < 0) {
                        if (!inverted) {
                            setInverted(true);
                        }
                    } else {
                        if (inverted) {
                            setInverted(false);
                        }
                    }
                }
            }
        };
        document.addEventListener('scroll', listener, true);
        return () => {
            document.removeEventListener('scroll', listener);
        };
    });

    return (
        <div className='autocomplete' ref={autocompleteRef} style={style as any}>
            <Input
                {...trimmedProps}
                style={props.inputStyle}
                innerref={inputRef}
                className={(props.className || '') + ' autocomplete__input'}
                onChange={(e) => {
                    if (props.onChange) {
                        props.onChange(e);
                    }
                }}
                onFocus={() => setShowSuggestions(true)}
            />
            <div ref={menuRef}>
                <ThemeDiv className={`autocomplete__items ${inverted ? 'autocomplete__items--inverted' : ''}`} hidden={!showSuggestions || (props.items || []).length < 1}>
                    {(curItems || []).map((i, n) => (
                        <div
                            key={i}
                            onClick={() => {
                                props.onChange({target: {value: i}} as React.ChangeEvent<HTMLInputElement>);
                                setShowSuggestions(false);
                                if (props.onItemClick) {
                                    props.onItemClick(i);
                                }
                            }}
                            className={`autocomplete__items__item ${pos === n ? 'autocomplete__items__item--selected' : ''}`}>
                            {i}
                        </div>
                    ))}
                </ThemeDiv>
            </div>
        </div>
    );
};
