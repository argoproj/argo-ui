import * as React from 'react';

import {default as classNames} from 'classnames';

export interface Tab {
    title: string;
    icon?: string;
    badge?: string | number;
    key: string;
    content: React.ReactNode;
    isOnlyContentScrollable?: boolean;
    noPadding?: boolean;
    extraVerticalScrollPadding?: number;
    extraHorizontalScrollPadding?: number;
}

export interface TabsProps extends React.Props<any> {
    navCenter?: boolean;
    fixed?: boolean;
    navTransparent?: boolean;
    tabs: Tab[];
    selectedTabKey?: string;
    onTabSelected?: (tabKey: string) => any;
}

export interface TabsState {
    selectedTabKey?: string;
    indicatorPosition: { left: number; right: number; directionToLeft: boolean };
}

require('./tabs.scss');

export class Tabs extends React.Component<TabsProps, TabsState> {
    private container: HTMLElement | null = null;

    constructor(props: TabsProps) {
        super(props);
        this.state = { selectedTabKey: props.selectedTabKey, indicatorPosition: { left: 0, right: 0, directionToLeft: false } };
    }

    public componentDidUpdate() {
        this.refreshIndicatorPosition();
    }

    public componentDidMount() {
        this.refreshIndicatorPosition();
    }

    public render() {
        const selectedTab = this.props.tabs.find((tab) => this.isTabSelected(tab));
        return (
            <div className='tabs' ref={(container) => this.container = container}>
                <div className={classNames('tabs__nav', { center: this.props.navCenter, transparent: this.props.navTransparent })}>
                    <div className={classNames({'fixed-width': this.props.fixed})}>
                        <div className={classNames('tabs__nav-wrapper')}>
                            {this.props.tabs.map((tab) => (
                                <a key={tab.key} onClick={() => this.selectTab(tab)} className={classNames({active: this.isTabSelected(tab)})}>
                                    {tab.icon && <i className={`fa ${tab.icon}`}/>} {tab.title}
                                    {tab.badge && <span className='fa-stack has-badge' data-count={tab.badge}/>}
                                </a>
                            ))}
                            <div className={classNames('tabs__indicator', {
                                'to-right': !this.state.indicatorPosition.directionToLeft,
                                'to-left': this.state.indicatorPosition.directionToLeft,
                            })} style={{left: this.state.indicatorPosition.left, right: this.state.indicatorPosition.right}}/>
                        </div>
                    </div>
                </div>
                {selectedTab && (
                    <div className={classNames('tabs__content', {
                            'tabs__content--scrollable': selectedTab.isOnlyContentScrollable,
                            'tabs__content--no-padding': selectedTab.noPadding,
                        })}
                        style={{
                            height: selectedTab.isOnlyContentScrollable ? `calc(100vh - ${selectedTab.extraVerticalScrollPadding || 0}px)` : 'inherit',
                            width: `calc(100% - ${selectedTab.extraHorizontalScrollPadding || 0}px)`,
                        }}>
                        {selectedTab.content}
                    </div>
                )}
            </div>
        );
    }

    private selectTab(tab: Tab) {
        this.setState({ selectedTabKey: tab.key });
        if (this.props.onTabSelected) {
            this.props.onTabSelected(tab.key);
        }
    }

    private isTabSelected(tab: Tab) {
        let selectedTabKey = this.state.selectedTabKey;
        if (!selectedTabKey && this.props.tabs.length > 0) {
            selectedTabKey = this.props.tabs[0].key;
        }
        return selectedTabKey === tab.key;
    }

    private getIndicatorPosition(parentEl: HTMLElement, el: HTMLElement) {
        return {
            left: el.offsetLeft,
            right: parentEl.offsetWidth - el.offsetWidth - el.offsetLeft,
            directionToLeft: this.state.indicatorPosition.left > el.offsetLeft,
        };
    }

    private refreshIndicatorPosition() {
        setTimeout(() => {
            if (this.container) {
                const parentEl = this.container.querySelector<HTMLElement>('.tabs__nav-wrapper');

                if (parentEl) {
                    const el = parentEl.querySelector<HTMLElement>('.active');

                    if (el) {
                        const newIndicatorPosition = this.getIndicatorPosition(parentEl, el);

                        if (JSON.stringify(this.state.indicatorPosition) !== JSON.stringify(newIndicatorPosition)) {
                            this.setState({
                                indicatorPosition: this.getIndicatorPosition(parentEl, el),
                            });
                        }
                    }
                }
            }
        }, 0);
    }
}
