import * as React from 'react';

import * as classNames from 'classnames';

export interface Tab {
    title: string;
    icon?: string;
    key: string;
    content: React.ComponentType;
    isOnlyContentScrollable?: boolean;
    noPadding?: boolean;
    extraVerticalScrollPadding?: number;
    extraHorizontalScrollPadding?: number;
}

interface Props {
    navCenter?: boolean;
    fixed?: boolean;
    transparent?: boolean;
    tabs: Tab[];
    selectedTabKey?: string;
    onTabSelected?: (tabKey: string) => any;
}

interface State {
    selectedTabKey: string;
}

require('./tabs.scss');

export class Tabs extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { selectedTabKey: props.selectedTabKey };
    }

    public render() {
        const selectedTab = this.props.tabs.find((tab) => this.isTabSelected(tab));
        return (
            <div className='tabs'>
                <div className={classNames('tabs__nav', { navCenter: this.props.navCenter, transparent: this.props.transparent })}>
                    <div className={classNames({'fixed-width': this.props.fixed})}>
                        <div className={classNames('tabs__nav-wrapper', {'text-center': this.props.navCenter})}>
                            {this.props.tabs.map((tab) => (
                                <a key={tab.key} onClick={() => this.selectTab(tab)} className={classNames({active: this.isTabSelected(tab)})}>
                                    {tab.icon && <i className={`fa ${tab.icon}`}/>} {tab.title}
                                </a>
                            ))}
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
                        <selectedTab.content/>
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
}
