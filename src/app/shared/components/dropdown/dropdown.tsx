import * as classNames from 'classnames';
import * as React from 'react';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export interface DropDownProps extends React.Props<any> {
    isMenu?: boolean;
    anchor: React.ComponentType;
}

export interface DropDownState {
    opened: boolean;
    left: number;
    top: number;
}

require('./dropdown.scss');

const dropDownOpened = new BehaviorSubject<DropDown>(null);

export class DropDown extends React.Component<DropDownProps, DropDownState> {
    private el: HTMLDivElement;
    private subscription: Subscription;

    constructor(props: DropDownProps) {
        super(props);
        this.state = { opened: false, left: 0, top: 0};
    }

    public render() {
        return (
            <div className='argo-dropdown' ref={(el) => this.el = el}>
                <div className='argo-dropdown__anchor' onClick={() => this.open()}>
                    <this.props.anchor/>
                </div>
                <div className={classNames('argo-dropdown__content', { 'opened': this.state.opened, 'is-menu': this.props.isMenu })}
                    style={{top: this.state.top, left: this.state.left}}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    public componentWillMount() {
        this.subscription = Observable.merge(
            dropDownOpened.filter((dropdown) => dropdown !== this),
            Observable.fromEvent(document, 'click').filter((event: Event) => !this.el.contains(event.target as Node) && this.state.opened),
        ).subscribe(() => this.close());
    }

    public componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    private close() {
        this.setState({ opened: false });
    }

    private open() {
        let scrollWindowTop = 0;
        let scrollWindowLeft = 0;
        let offsetParent = this.el.offsetParent as HTMLElement;
        let top = this.el.offsetTop;
        let left = this.el.offsetLeft;
        const anchor = this.el.querySelector('.argo-dropdown__anchor') as HTMLElement;
        const content = this.el.querySelector('.argo-dropdown__content') as HTMLElement;
        const anchorHeight = anchor.offsetHeight + 2;

        for (; offsetParent !== null; offsetParent = offsetParent.offsetParent as HTMLElement) {
            scrollWindowTop += offsetParent.scrollTop;
            scrollWindowLeft += offsetParent.scrollLeft;
            top += offsetParent.offsetTop;
            left += offsetParent.offsetLeft;
        }

        const newState = { left: this.state.left, top: this.state.top, opened: this.state.opened };
        // Set top position
        if (content.offsetHeight + top + anchorHeight - scrollWindowTop > window.innerHeight) {
            newState.top = anchor.offsetTop - content.offsetHeight - 2;
        } else {
            newState.top = anchor.offsetTop + anchorHeight;
        }

        // Set left position
        if (content.offsetWidth + left - scrollWindowLeft > window.innerWidth) {
            newState.left = anchor.offsetLeft - content.offsetWidth + anchor.offsetWidth;
        } else {
            newState.left = anchor.offsetLeft;
        }

        newState.opened = true;
        this.setState(newState);
        dropDownOpened.next(this);
    }
}
