import * as classNames from 'classnames';
import * as React from 'react';
import * as ReactAutocomplete from 'react-autocomplete';

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
}

function setupMenuPositionOverride(autocomplete: ReactAutocomplete) {
    const untyped = autocomplete as any;

    if (!untyped.setMenuPositionsOverridden) {
        untyped.setMenuPositionsOverridden = true;
        untyped.setMenuPositions = () => {
            // Overridden setMenuPositions implementation: expands menu to the top if there is not enough space below the input but enough above it.
            if (autocomplete.refs.menu && autocomplete.refs.input) {
                const input = autocomplete.refs.input as HTMLElement;
                const menu = autocomplete.refs.menu as HTMLElement;

                const rect = input.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(input);
                const marginBottom = parseInt(computedStyle.marginBottom, 10) || 0;
                const marginLeft = parseInt(computedStyle.marginLeft, 10) || 0;
                const marginRight = parseInt(computedStyle.marginRight, 10) || 0;

                let menuTop = rect.bottom + marginBottom;

                if (window.innerHeight - (menuTop + menu.offsetHeight) < 0) {
                    const correctedTop = menuTop - menu.offsetHeight - input.offsetHeight;
                    if (correctedTop > 0) {
                        menuTop = correctedTop;
                    }
                }
                autocomplete.setState({
                    menuTop,
                    menuLeft: rect.left + marginLeft,
                    menuWidth: rect.width + marginLeft + marginRight,
                });
            }
        };
    }
}

// TODO: We should file a bug against the type definitions to add this if it's intended
// to be a public method.  If not, refactor this class name/comment to reflect that we're
// modifying non-public APIs intentionally.
type CorrectedReactAutocomplete = ReactAutocomplete & {
    menuStyle: Record<string, string>;
    setMenuPositions(): void;
};

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
    const [autocompleteEl, setAutocompleteEl] = React.useState<CorrectedReactAutocomplete | null>(null);

    React.useEffect(() => {
        const listener = (event: any) => {
            // Recalculate menu position on scroll
            if (autocompleteEl && autocompleteEl.refs.input && autocompleteEl.refs.menu && !(event.target === autocompleteEl.refs.menu)) {
                autocompleteEl.setMenuPositions();
            }
        };
        document.addEventListener('scroll', listener, true);
        return () => {
            document.removeEventListener('scroll', listener);
        };
    });

    const wrapperProps = props.wrapperProps || {};
    wrapperProps.className = classNames('select', wrapperProps.className);
    return (
        <ReactAutocomplete
            autoHighlight={true}
            ref={(el: CorrectedReactAutocomplete | null) => {
                if (el) {
                    if (el.refs.input) {
                        // workaround for 'autofill for forms not deactivatable' https://bugs.chromium.org/p/chromium/issues/detail?id=370363#c7
                        (el.refs.input as HTMLInputElement).autocomplete = 'no-autocomplete';
                    }

                    setupMenuPositionOverride(el);
                }

                setAutocompleteEl(el);

                if (props.autoCompleteRef) {
                    props.autoCompleteRef({
                        refresh: () => {
                            if (el && el.refs.input) {
                                el.setMenuPositions();
                            }
                        },
                    });
                }
            }}
            inputProps={props.inputProps}
            wrapperProps={wrapperProps}
            shouldItemRender={(item: AutocompleteOption, val: string) => {
                return !props.filterSuggestions || (!!item.label && item.label.includes(val));
            }}
            renderMenu={function(this: CorrectedReactAutocomplete, menuItems, _, style) {
                if (menuItems.length === 0) {
                    return <div style={{display: 'none'}} />;
                }
                return <div style={{...style, ...this.menuStyle, background: 'white', zIndex: 10, maxHeight: '20em'}} children={menuItems} />;
            }}
            getItemValue={(item) => item.label}
            items={items}
            value={props.value}
            renderItem={(item, isSelected) => (
                <div className={classNames('select__option', {selected: isSelected})} key={item.label}>
                    {(props.renderItem && props.renderItem(item)) || item.label}
                </div>
            )}
            onChange={props.onChange}
            onSelect={props.onSelect}
            renderInput={props.renderInput}
        />
    );
};
