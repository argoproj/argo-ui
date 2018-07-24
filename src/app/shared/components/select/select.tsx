import * as classNames from 'classnames';
import * as React from 'react';
import { Observable, Subscription } from 'rxjs';

export interface SelectOption {
    value: string;
    title: string;
}

interface State {
    selected: SelectOption;
    toTop: boolean;
    opened: boolean;
    search: string;
}

export interface SelectProps {
    placeholder?: string;
    value?: string;
    options: Array<SelectOption | string>;
    onChange?: (option: SelectOption) => any;
}

require('./select.scss');

function normalizeOptions(options: Array<SelectOption | string>) {
    return options.map((item) => typeof item === 'string' ? ({ value: item, title: item }) : item);
}

export class Select extends React.Component<SelectProps, State> {

    public static getDerivedStateFromProps(nextProps: SelectProps, prevState: State): Partial<State> {
        const prevSelected = prevState.selected && prevState.selected.value || null;
        const nextSelected = nextProps.value === null || nextProps.value === undefined ? null : nextProps.value;
        if (prevSelected !== nextProps.value) {
            return {
                selected: nextSelected != null ? normalizeOptions(nextProps.options).find((option) => option.value === nextProps.value) : null,
            };
        }
        return null;
    }

    private el: HTMLElement;
    private searchEl: HTMLInputElement;
    private subscription: Subscription;

    public constructor(props: SelectProps) {
        super(props);
        const selected = props.value ? normalizeOptions(props.options).find((option) => option.value === props.value) : null;
        this.state = { opened: false, search: '', selected, toTop: false };
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
        if (this.state.search) {
            options = options.filter((item) => item.title.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase()));
        }
        return (
            <div className='select' ref={(el) => this.el = el}>
                <div className='select__value' onClick={() => this.openDropdown()}>
                    {this.state.selected ? this.state.selected.title : this.props.placeholder || ''}
                    <div className='select__value-arrow'><i className='argo-icon-expand-arrow'/></div>
                </div>
                <div className={classNames('select__options', { 'opened': this.state.opened, 'to-top': this.state.toTop })}>
                    <input className='select__search' type='text' placeholder='Search' value={this.state.search}
                        onChange={(event) => this.onSearchChange(event)} ref={(el) => this.searchEl = el} />
                    {options.map((option) => (
                        <div key={option.value}
                                className={classNames('select__option', { selected: this.state.selected && option.value === this.state.selected.value })}
                                onClick={() => this.select(option)}>
                            {option.title}
                        </div>
                    ))}
                    {options.length === 0 && <div className='select__empty'>No results</div>}
                </div>
            </div>
        );
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

            setTimeout(() => this.searchEl.focus(), 1000);
        }
    }

    private select(option: SelectOption) {
        this.setState({ selected: option, opened: false, search: '' });
        if (this.props.onChange) {
            this.props.onChange(option);
        }
    }
}
