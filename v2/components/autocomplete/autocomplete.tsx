import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Key, KeybindingContext, KeybindingProvider, useNav} from '../../shared';
import {Input, InputProps, SetInputFxn, useDebounce, useInput} from '../input/input';
import ThemeDiv from '../theme-div/theme-div';

import './autocomplete.scss';

interface AutocompleteProps extends InputProps {
    inputref?: React.MutableRefObject<HTMLInputElement>;
}

export const useAutocomplete = (init: string): [string, SetInputFxn, AutocompleteProps] => {
    const [state, setState, input] = useInput(init);
    const autocomplete = input as AutocompleteProps;
    if (autocomplete.ref) {
        autocomplete.inputref = input.ref;
        delete autocomplete.ref;
    }
    return [state, setState, autocomplete];
};

export const Autocomplete = (
    props: React.InputHTMLAttributes<HTMLInputElement> & {
        items: string[];
        abbreviations?: Map<string, string>;
        inputStyle?: React.CSSProperties;
        onItemClick?: (item: string) => void;
        icon?: string;
        inputref?: React.MutableRefObject<HTMLInputElement>;
    },
) => {
    return (
        <KeybindingProvider>
            <RenderAutocomplete {...props} />
        </KeybindingProvider>
    );
};

export const RenderAutocomplete = (
    props: React.InputHTMLAttributes<HTMLInputElement> & {
        items: string[];
        abbreviations?: Map<string, string>;
        inputStyle?: React.CSSProperties;
        onItemClick?: (item: string) => void;
        icon?: string;
        inputref?: React.MutableRefObject<HTMLInputElement>;
    },
) => {
    const [curItems, setCurItems] = React.useState(props.items || []);
    const nullInputRef = React.useRef<HTMLInputElement>(null);
    const inputRef = props.inputref || nullInputRef;
    const autocompleteRef = React.useRef(null);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [pos, nav, reset] = useNav(props.items?.length);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        function unfocus(e: any) {
            if (autocompleteRef.current && !autocompleteRef.current.contains(e.target) && menuRef.current && !menuRef.current.contains(e.target)) {
                setShowSuggestions(false);
                reset();
            }
        }

        document.addEventListener('mousedown', unfocus);
        return () => document.removeEventListener('mousedown', unfocus);
    }, [autocompleteRef]);

    const debouncedVal = useDebounce(props.value as string, 350);

    React.useEffect(() => {
        const filtered = (props.items || []).filter((i) => {
            if (i) {
                return props.abbreviations !== undefined
                ? i.toLowerCase().includes(debouncedVal?.toLowerCase()) || props.abbreviations.get(i)?.includes(debouncedVal?.toLowerCase())
                : i.toLowerCase().includes(debouncedVal?.toLowerCase());
            }
            return false;
        });
        setCurItems(filtered.length > 0 ? filtered : props.items);
    }, [debouncedVal, props.items]);

    React.useEffect(() => {
        if (props.value !== null && props.value !== '') {
            setShowSuggestions(true);
        }
    }, [props.value]);

    const {useKeybinding} = React.useContext(KeybindingContext);

    const target = {
        combo: false,
        target: inputRef,
    };

    useKeybinding({
        keys: Key.TAB,
        action: () => {
            if (showSuggestions) {
                if (pos === curItems.length - 1) {
                    reset();
                }
                nav(1);
                return true;
            }
            return false;
        },
        ...target,
    });

    useKeybinding({
        keys: Key.ESCAPE,
        action: (e) => {
            if (showSuggestions) {
                reset();
                setShowSuggestions(false);
                if (inputRef && inputRef.current) {
                    inputRef.current.blur();
                }
                return true;
            }
            return false;
        },
        ...target,
    });

    useKeybinding({
        keys: Key.ENTER,
        action: () => {
            if (showSuggestions && props.onItemClick) {
                props.onItemClick(curItems[pos]);
                setShowSuggestions(false);
                return true;
            }
            return false;
        },
        ...target,
    });

    useKeybinding({
        keys: Key.UP,
        action: (e) => {
            if (showSuggestions) {
                nav(-1);
                return false;
            }
            return true;
        },
        ...target,
    });

    useKeybinding({
        keys: Key.DOWN,
        action: () => {
            if (showSuggestions) {
                nav(1);
                return false;
            }
            return true;
        },
        ...target,
    });

    const style = props.style;
    const trimmedProps = {...props};
    delete trimmedProps.style;
    delete trimmedProps.inputStyle;
    delete trimmedProps.onItemClick;

    const [position, setPosition] = React.useState({top: 0, left: 0});

    const checkDirection = () => {
        if (autocompleteRef && autocompleteRef.current && menuRef.current) {
            if (inputRef.current && menuRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                const menuHeight = menuRef.current.clientHeight;
                const offset = window.innerHeight - rect.bottom;
                const inverted = offset < menuHeight;

                const newPos = {
                    top: inverted ? rect.top - menuRef.current.clientHeight : rect.top + rect.height,
                    left: rect.left,
                };
                if (position.left !== newPos.left || position.top !== newPos.top) {
                    setPosition(newPos);
                }
            }
        }
    };

    React.useEffect(() => {
        checkDirection();
        document.addEventListener('scroll', checkDirection, true);
        document.addEventListener('resize', checkDirection, true);
        return () => {
            document.removeEventListener('scroll', checkDirection);
            document.removeEventListener('resize', checkDirection);
        };
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) {
            props.onChange(e);
        }
    };

    return (
        <div className='autocomplete' ref={autocompleteRef} style={style as any}>
            <Input
                {...trimmedProps}
                style={props.inputStyle}
                innerref={inputRef}
                className={(props.className || '') + ' autocomplete__input'}
                onChange={onChange}
                onFocus={() => {
                    setShowSuggestions(true);
                    checkDirection();
                }}
            />

            {ReactDOM.createPortal(
                <ThemeDiv
                    className='autocomplete__items'
                    style={{
                        visibility: !showSuggestions || (props.items || []).length < 1 ? 'hidden' : 'visible',
                        overflow: !showSuggestions || (props.items || []).length < 1 ? 'hidden' : null,
                        top: position.top,
                        left: position.left,
                    }}
                    innerref={menuRef}>
                    {(curItems || []).map((i, n) => (
                        <div
                            key={i}
                            onClick={() => {
                                onChange({target: {value: i}} as React.ChangeEvent<HTMLInputElement>);
                                setShowSuggestions(false);
                                if (props.onItemClick) {
                                    props.onItemClick(i);
                                }
                            }}
                            className={`autocomplete__items__item ${pos === n ? 'autocomplete__items__item--selected' : ''}`}>
                            {i}
                        </div>
                    ))}
                </ThemeDiv>,
                document.body,
            )}
        </div>
    );
};
