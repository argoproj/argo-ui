import { storiesOf } from '@storybook/react';
import {default as classNames} from 'classnames';
import * as React from 'react';

class TableExample extends React.Component<{}, {selectedIndex: number}> {

    constructor(props: any) {
        super(props);
        this.state = { selectedIndex: 0 };
    }

    public render() {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return (
            <div className='argo-table-list argo-table-list--clickable'>
                <div className='argo-table-list__head'>
                    <div className='row'>
                        <div className='columns small-2'> Header 1 </div>
                        <div className='columns small-5'> Header 2 </div>
                        <div className='columns small-5'> Header 3 </div>
                    </div>
                </div>
                {items.map((item, i) => (
                    <div className={classNames('argo-table-list__row', { selected: i === this.state.selectedIndex })} key={i} onClick={() => this.setState({ selectedIndex: i })}>
                        <div className='row'>
                            <div className='columns small-2'> Cell 1 {item} </div>
                            <div className='columns small-5'> Cell 2 {item}</div>
                            <div className='columns small-5'> Cell 3 {item}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

storiesOf('Table', module)
    .add('default', () => <TableExample/>);
