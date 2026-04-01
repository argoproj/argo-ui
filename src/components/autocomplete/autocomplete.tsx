import {default as classNames} from 'classnames';
import * as React from 'react';
import {useState, useRef, useCallback, useEffect} from 'react';
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from 'downshift';

require('./autocomplete.scss');
export interface AutocompleteApi {
    refresh(): any;
}

export interface AutocompleteOption {
    value: string;
    label?: string;
}

export interface AutocompleteProps {
    items: (AutocompleteOption | string)[];
    value?: string;
    inputProps?: React.HTMLProps<HTMLInputElement>;
    wrapperProps?: React.HTMLProps<HTMLDivElement>;
    renderInput?: (props: React.HTMLProps<HTMLInputElement>) => React.ReactNode;
    renderItem?: (item: AutocompleteOption) => React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    onSelect?: (value: string, item: any) => void;
    autoCompleteRef?: (api: AutocompleteApi) => any;
    filterSuggestions?: boolean;
    qeid?: string;
    autoHighlight?: boolean;
}

export const Autocomplete = (props: AutocompleteProps) => {
    const items = (props.items || []).map((item) => {
        if (typeof item === 'string') {
            return {value: item, label: item};
        } else {
            return {
                value: item.value,
                label: item.label || item.value,
            };
        }
    });
    const wrapperProps = props.wrapperProps || {};
    const [menuTop, setMenuTop] = useState(0);
    const [menuLeft, setMenuLeft] = useState(0);
    const [menuWidth, setMenuWidth] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [inputValue, setInputValue] = useState(props.value || '');
    const [prevPropsValue, setPrevPropsValue] = useState(props.value);
    if (prevPropsValue !== props.value) {
        setPrevPropsValue(props.value);
        setInputValue(props.value || '');
    }
    const filteredItems = items.filter((item) => !props.filterSuggestions || item.label.toLowerCase().includes(inputValue.toLowerCase()));

    const {
        isOpen,
        highlightedIndex,
        getMenuProps,
        getInputProps,
        getItemProps,
        openMenu,
    } = useCombobox({
        items: filteredItems,
        itemToString: (item) => item?.label || '',
        inputValue,
        defaultHighlightedIndex: props.autoHighlight === false ? -1 : 0,
        onSelectedItemChange: ({selectedItem}) => {
            if (selectedItem && props.onSelect) {
                props.onSelect(selectedItem.label, selectedItem);
            }
        },
        onInputValueChange: ({inputValue: newValue}) => {
            setInputValue(newValue || '');
        },
        stateReducer: (_state: UseComboboxState<{value: string; label: string}>, {type, changes}: UseComboboxStateChangeOptions<{value: string; label: string}>) => {
            if (type === useCombobox.stateChangeTypes.InputClick) {
                return {...changes, isOpen: true};
            }
            return changes;
        },
    });

    const setMenuPositions = useCallback(() => {
        if (!inputRef.current) {
            return;
        }
        const rect = inputRef.current.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(inputRef.current);
        const marginBottom = parseInt(computedStyle.marginBottom, 10) || 0;
        const marginLeft = parseInt(computedStyle.marginLeft, 10) || 0;
        const marginRight = parseInt(computedStyle.marginRight, 10) || 0;
        let top = rect.bottom + marginBottom;
        if (menuRef.current) {
            const overflow = window.innerHeight - (rect.bottom + marginBottom + menuRef.current.offsetHeight);
            if (overflow < 0) {
                const correctedTop = rect.top - menuRef.current.offsetHeight - inputRef.current.offsetHeight;
                if (correctedTop > 0) {
                    top = correctedTop;
                }
            }
        }
        setMenuTop(top);
        setMenuLeft(rect.left + marginLeft);
        setMenuWidth(rect.width + marginLeft + marginRight);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        setMenuPositions();
        const listener = (event: Event) => {
            if (menuRef.current && event.target === menuRef.current) {
                return;
            }
            setMenuPositions();
        };
        document.addEventListener('scroll', listener, true);
        window.addEventListener('resize', listener);
        return () => {
            document.removeEventListener('scroll', listener, true);
            window.removeEventListener('resize', listener);
        };
    }, [isOpen, setMenuPositions]);

    useEffect(() => {
        if (props.autoCompleteRef) {
            props.autoCompleteRef({refresh: setMenuPositions});
        }
    }, [props, setMenuPositions]);
    const inputProps = getInputProps({
        ...(props.inputProps || {}),
        qeid: props.qeid,
        value: inputValue,
        autoComplete: 'off',
        ref: (node: HTMLInputElement | null) => {
            inputRef.current = node;
        },
        onFocus: (event: React.FocusEvent<HTMLInputElement>) => {
            openMenu();
            if (props.inputProps?.onFocus) {
                props.inputProps.onFocus(event);
            }
        },
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            if (props.onChange) {
                props.onChange(event, event.target.value);
            }
            if (props.inputProps?.onChange) {
                props.inputProps.onChange(event);
            }
        },
    });
    const menuProps = getMenuProps({
        className: 'autocomplete__menu',
        ref: (node: HTMLDivElement | null) => { menuRef.current = node; },
    }, {suppressRefError: true});

    const menuStyle: React.CSSProperties = {
        position: 'fixed',
        top: menuTop,
        left: menuLeft,
        width: menuWidth,
        background: 'white',
        zIndex: 20,
        maxHeight: '20em',
        overflowY: 'auto',
    };

    wrapperProps.className = classNames('select', wrapperProps.className);

    return (
        <div {...wrapperProps}>
            {props.renderInput ? (
                props.renderInput(inputProps as React.HTMLProps<HTMLInputElement>)
            ) : (
                <input {...inputProps} />
            )}
            {isOpen && filteredItems.length > 0 && (
                <div {...menuProps} style={menuStyle}>
                    {filteredItems.map((item, index) => (
                        <div
                            {...getItemProps({item, index})}
                            className={classNames('select__option', {selected: highlightedIndex === index})}
                            key={item.label}
                            onMouseDown={(event) => event.preventDefault()}>
                            {(props.renderItem && props.renderItem(item)) || item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
