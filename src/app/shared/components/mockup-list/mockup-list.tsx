import * as React from 'react';

export interface MockupListProps { height?: number; marginTop?: number; }

require('./mockup-list.scss');

export class MockupList extends React.Component<MockupListProps, { count: number; }> {

    constructor(props: MockupListProps) {
        super(props);
        this.state = { count: 0 };
    }

    public componentDidMount() {
        this.setState({count: Math.round(window.innerHeight /  ( this.itemHeight + this.itemMarginTop )) });
    }

    public render() {
        const items = [];
        for (let i = 0; i < this.state.count; i++) {
            items.push(i);
        }
        return (
        <div className='mockup-list'>
            { items.map((i: number) => (
                <div className='mockup-list__item' key={i} style={{ height: this.itemHeight, marginTop: this.itemMarginTop }}>
                    <div className='mockup-list__wave-loader'/>
                </div>
            ))}
        </div>);
    }

    private get itemHeight() {
        return this.props.height || 60;
    }

    private get itemMarginTop() {
        return this.props.marginTop || 20;
    }
}
