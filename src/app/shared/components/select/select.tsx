import * as classNames from 'classnames';
import * as React from 'react';
import * as ReactAutocomplete from 'react-autocomplete';
import { Observable, Subscription } from 'rxjs';

import { Checkbox } from '../checkbox';

export interface SelectOption {
    value: string;
    title: string;
}

interface State {
    selected: string[];
    toTop: boolean;
    opened: boolean;
    search: string;
}

export interface SelectProps {
    placeholder?: string;
    value?: string | string[];
    options: Array<SelectOption | string>;
    onChange?: (option: SelectOption) => any;
    onMultiChange?: (options: SelectOption[]) => any;
    multiSelect?: boolean;
}

export interface AutocompleteProps {
    options: Array<SelectOption | string>;
    value: string;
    onChange?: (value: string) => any;
    inputProps?: React.HTMLProps<HTMLInputElement>;
    wrapperProps?: React.HTMLProps<HTMLDivElement>;
}

require('./select.scss');

function normalizeOptions(options: Array<SelectOption | string>) {
    return options.map((item) => typeof item === 'string' ? ({ value: item, title: item }) : item);
}

export const Autocomplete = (props: AutocompleteProps) => {
    const options = normalizeOptions(props.options);
    return (
        <ReactAutocomplete
            inputProps={props.inputProps}
            wrapperProps={props.wrapperProps}
            renderItem={(option: SelectOption, selected: boolean) => (
            <div className={classNames('select__option', { selected })} key={option.value}>
                {option.title}
            </div>
        )}
        onSelect={(val) => props.onChange && props.onChange(val)}
        onChange={(_, val) => props.onChange && props.onChange(val)}
        value={props.value} items={options} getItemValue={(opt: SelectOption) => opt.value}/>
    );
};

export class Select extends React.Component<SelectProps, State> {

    public static getDerivedStateFromProps(nextProps: SelectProps, prevState: State): Partial<State> {
        let selected: Array<string> = [];
        if (nextProps.value) {
            selected = nextProps.value instanceof Array ? nextProps.value as Array<string> : [nextProps.value];
        }
        const a = new Set(selected);
        const b = new Set(prevState.selected);
        const isEqual = a.size === b.size && Array.from(a).every((value) => b.has(value));
        if (!isEqual) {
            return { selected };
        }

        return null;
    }

    private el: HTMLElement;
    private searchEl: HTMLInputElement;
    private subscription: Subscription;

    public constructor(props: SelectProps) {
        super(props);
        this.state = { opened: false, search: '', selected: [], toTop: false };
    }

    public componentDidMount() {
        this.subscription = Observable.fromEvent(document, 'click')
            .filter((event: Event) => !this.el.contains(event.target as Node) && this.state.opened)
            .subscribe(() => this.setState({ opened: false }));
    }

    public componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    public render() {
        let options = normalizeOptions(this.props.options);
        const selectedOptions = options.filter((item) => this.state.selected.includes(item.value));
        if (this.state.search) {
            options = options.filter((item) => item.title.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase()));
        }
        return (
            <div className='select' ref={(el) => this.el = el}>
                <div className='select__value' onClick={() => this.openDropdown()}>
                    {selectedOptions.length > 0 ? selectedOptions.map((item) => item.title).join(', ') : this.props.placeholder || ''}
                    <div className='select__value-arrow'><i className='argo-icon-expand-arrow'/></div>
                </div>
                <div className={classNames('select__options', { 'opened': this.state.opened, 'to-top': this.state.toTop })}>
                    <input className='select__search' type='text' placeholder='Search' value={this.state.search}
                        onChange={(event) => this.onSearchChange(event)} ref={(el) => this.searchEl = el} />
                    {options.map((option) => (
                        <div key={option.value}
                                className={classNames('select__option', { selected: this.isSelected(option) })}
                                onClick={() => this.select(option)}>
                            {this.props.multiSelect && <Checkbox checked={this.isSelected(option)}/>} <span>
                                {option.title}
                            </span>
                        </div>
                    ))}
                    {options.length === 0 && <div className='select__empty'>No results</div>}
                </div>
            </div>
        );
    }

    private isSelected(option: SelectOption) {
        return !!this.state.selected.includes(option.value);
    }

    private onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ search: event.target.value });
    }

    private openDropdown() {
        if (this.el && this.searchEl) {
            let offsetParent = this.el.offsetParent as HTMLElement;
            let top = this.el.offsetTop;
            const scrollWindowTop = window.pageYOffset || document.documentElement.scrollTop;

            for (; offsetParent !== null; offsetParent = offsetParent.offsetParent as HTMLElement) {
                top += offsetParent.offsetTop;
            }

            this.setState({
                toTop: (this.el.querySelector('.select__options') as HTMLElement).offsetHeight + top - scrollWindowTop > window.innerHeight,
                opened: true,
            });

            setTimeout(() => this.searchEl && this.searchEl.focus(), 1000);
        }
    }

    private select(option: SelectOption) {
        if (this.props.multiSelect) {
            const index = this.state.selected.indexOf(option.value);
            const nextSelected = this.state.selected.slice();
            if (index > -1) {
                nextSelected.splice(index, 1);
            } else {
                nextSelected.push(option.value);
            }
            this.setState({ selected: nextSelected, opened: true });
            if (this.props.onMultiChange) {
                const selectedOptions = normalizeOptions(this.props.options).filter((item) => nextSelected.includes(item.value));
                this.props.onMultiChange(selectedOptions);
            }
        } else {
            this.setState({ selected: [option.value], opened: false, search: '' });
            if (this.props.onChange) {
                this.props.onChange(option);
            }
        }
    }
}
