import * as React from 'react';

require('./slide-contents.scss');

export interface SlideContentsProps {
    title: string;
    contents: JSX.Element;
    className: string;
}

export interface SlideContentsState {
    hidden: boolean;
}

export class SlideContents extends React.Component<SlideContentsProps, SlideContentsState> {
    constructor(props: SlideContentsProps) {
        super(props);

        this.state = {
            hidden: true,
        };

        this.showContents = this.showContents.bind(this);
        this.hideContents = this.hideContents.bind(this);
    }

    public showContents() {
        this.setState({ hidden: false });
    }

    public hideContents() {
        this.setState({ hidden: true });
    }

    public render() {
        const { title, contents, className } = this.props;
        const { hidden } = this.state;
        let toggleSwitch: JSX.Element | undefined;
        let clickAction: () => void;
        if (hidden) {
            toggleSwitch = <i className='fa fa-angle-down' aria-hidden='true' />;
            clickAction = this.showContents;
        } else {
            toggleSwitch = <i className='fa fa-angle-up' aria-hidden='true' onClick={this.hideContents} />;
            clickAction = this.hideContents;
        }
        return (
            <div className={`${className} slide-contents`}>
                <h4 className='slide-contents--title' onClick={clickAction}>
                    <span>{title}</span>
                    {toggleSwitch}
                </h4>
                <div className={'slide-contents--contents' + (hidden ? ' slide-contents--contents-hidden' : '')}>
                    <div className={className}>
                    {contents}
                    </div>
                </div>
            </div>
        );
    }
}
