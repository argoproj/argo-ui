import {default as classNames} from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BehaviorSubject, fromEvent, merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface DropDownProps {
    isMenu?: boolean;
    anchor: React.ComponentType;
    children: React.ReactNode | (() => React.ReactNode);
    qeId?: string;
    onOpenStateChange?: (open: boolean) => void;
}

export interface DropDownState {
    opened: boolean;
    left: number;
    top: number;
    maxHeight?: number;
}

require('./dropdown.scss');

const dropDownOpened = new BehaviorSubject<DropDown>(null);

export class DropDown extends React.Component<DropDownProps, DropDownState> {
    private el: HTMLDivElement;
    private content: HTMLDivElement;
    private subscriptions: Subscription[];
    private isFirstOpen = true;
    private resizeObserver: ResizeObserver | null = null;

    constructor(props: DropDownProps) {
        super(props);
        this.state = { opened: false, left: 0, top: 0};
    }

    public render() {
        let children: React.ReactNode = null;
        if (typeof this.props.children === 'function') {
            if (this.state.opened) {
                const fun = this.props.children as () => React.ReactNode;
                children = fun();
            }
        } else {
            children = this.props.children as React.ReactNode;
        }

        return (
            <div className='argo-dropdown' ref={(el) => { this.el = el; }}>
                <div qe-id={this.props.qeId} className='argo-dropdown__anchor' onClick={(event) => { this.open(); event.stopPropagation(); }}>
                    <this.props.anchor/>
                </div>
                {ReactDOM.createPortal((
                    <div className={classNames('argo-dropdown__content', { 'opened': this.state.opened, 'is-menu': this.props.isMenu })}
                        style={{
                            top: this.state.top,
                            left: this.state.left,
                            maxHeight: this.state.maxHeight,
                            overflowY: this.state.maxHeight === undefined ? undefined : 'auto',
                        }}
                        ref={(el) => { this.content = el; }}>
                        {children}
                    </div>
                ), document.body)}
            </div>
        );
    }

    public UNSAFE_componentWillMount() {
        this.subscriptions = [merge(
            dropDownOpened.pipe(filter((dropdown) => dropdown !== this)),
            fromEvent(document, 'click').pipe(filter((event: Event) => {
                const targetAttached = (event.target as Node).parentElement;
                return targetAttached && this.content && this.state.opened && !this.content.contains(event.target as Node) && !this.el.contains(event.target as Node);
            })),
        ).subscribe(() => {
            this.close();
        }), fromEvent(document, 'scroll', {passive: true}).subscribe(() => {
            if (this.state.opened && this.content && this.el) {
                this.setState(this.refreshState());
            }
        }), fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter((event) => event.key === 'Enter' || event.keyCode === 13)).subscribe((event) => {
            this.selectTopResult(event);
        })];
    }

    public componentWillUnmount() {
        (this.subscriptions || []).forEach((s) => s.unsubscribe());
        this.subscriptions = [];
        this.stopObservingContentSize();
    }

    public close() {
        this.setState({ opened: false });
        if (this.props.onOpenStateChange) {
            this.props.onOpenStateChange(false);
        }
    }

    private selectTopResult(event: KeyboardEvent) {
        if (!this.state.opened || !this.content || !this.el) {
            return;
        }
        const target = event.target as Node;
        if (target && !this.el.contains(target) && !this.content.contains(target)) {
            return;
        }
        const firstItem = this.content.querySelector('li') as HTMLElement;
        if (firstItem) {
            event.preventDefault();
            firstItem.click();
        }
    }

    private refreshState() {
        const anchor = this.el.querySelector('.argo-dropdown__anchor') as HTMLElement;
        const {top, left} = anchor.getBoundingClientRect();
        const anchorHeight = anchor.offsetHeight + 2;

        const newState: DropDownState = { left: this.state.left, top: this.state.top, opened: this.state.opened, maxHeight: undefined };
        // While the height is limited by maxHeight, scrollHeight is the height the content needs.
        const contentHeight = this.state.maxHeight === undefined ? this.content.offsetHeight : this.content.scrollHeight;
        const spaceBelow = window.innerHeight - top - anchorHeight;
        const spaceAbove = top - 2;
        // Set top position
        if (contentHeight <= spaceBelow) {
            newState.top = top + anchorHeight;
        } else if (contentHeight <= spaceAbove) {
            newState.top = top - contentHeight - 2;
        } else if (spaceBelow >= spaceAbove) {
            // Fits neither below nor above: use the side with more space and let the content scroll,
            // so that the items that don't fit are still reachable.
            newState.top = top + anchorHeight;
            newState.maxHeight = spaceBelow;
        } else {
            newState.top = top - spaceAbove - 2;
            newState.maxHeight = spaceAbove;
        }

        // Set left position
        if (this.content.offsetWidth + left > window.innerWidth) {
            newState.left = left - this.content.offsetWidth + anchor.offsetWidth;
        } else {
            newState.left = left;
        }
        return newState;
    }

    private positionChanged(newState: DropDownState) {
        return newState.left !== this.state.left || newState.top !== this.state.top || newState.maxHeight !== this.state.maxHeight;
    }

    // Content rendered by children can change size after the menu is positioned (e.g. items loaded
    // asynchronously) without re-rendering this component, so reposition when its size changes.
    private observeContentSize() {
        if (this.resizeObserver || !this.content || typeof ResizeObserver === 'undefined') {
            return;
        }
        this.resizeObserver = new ResizeObserver(() => {
            if (this.state.opened && this.content && this.el) {
                const newState = this.refreshState();
                if (this.positionChanged(newState)) {
                    this.setState(newState);
                }
            }
        });
        this.resizeObserver.observe(this.content);
    }

    private stopObservingContentSize() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }

    public componentDidUpdate(_prevProps: DropDownProps, prevState: DropDownState) {
        if (prevState.opened && !this.state.opened) {
            this.stopObservingContentSize();
        }

        // When menu changes from closed to open state
        if (!prevState.opened && this.state.opened) {
            this.observeContentSize();
            // Mark as first open
            this.isFirstOpen = true;
            // Use setTimeout to ensure content has been rendered
            setTimeout(() => {
                if (this.state.opened && this.content && this.el) {
                    const newState = this.refreshState();
                    // Only update state if calculated position differs from current position
                    if (this.positionChanged(newState)) {
                        this.setState(newState);
                    }
                    this.isFirstOpen = false;
                }
            }, 0);
        }
        
        // If content changes and it's not the first open, recalculate position
        if (this.state.opened && !this.isFirstOpen && this.content && this.el) {
            // Use setTimeout to ensure calculation happens after DOM updates
            setTimeout(() => {
                if (this.state.opened && this.content && this.el) {
                    const newState = this.refreshState();
                    if (this.positionChanged(newState)) {
                        this.setState(newState);
                    }
                }
            }, 0);
        }
    }

    private open() {
        if (!this.content || !this.el) {
            return;
        }

        const newState = this.refreshState();
        newState.opened = true;
        this.setState(newState);
        if (this.props.onOpenStateChange) {
            this.props.onOpenStateChange(true);
        }
    }
}
