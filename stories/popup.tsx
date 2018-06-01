import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { Popup, PopupApi , PopupManager, PopupProps} from '../src/app/shared/components';

class App extends React.Component<{ children: (popupApi: PopupApi) => React.ReactNode }, {popupProps: PopupProps}> {
    private popupManager: PopupManager;

    constructor(props: { children: (popupApi: PopupApi) => React.ReactNode }) {
        super(props);
        this.state = { popupProps: null };
        this.popupManager = new PopupManager();
    }

    public componentDidMount() {
        this.popupManager.popupProps.subscribe((popupProps) => this.setState({ popupProps }));
    }

    public render() {
        return (
            <div>
                {this.state.popupProps && <Popup {...this.state.popupProps}/>}
                {this.props.children(this.popupManager)}
            </div>
        );
    }
}

storiesOf('Popup', module)
    .add('confirmation', () => (
        <App>
            {(popupApi) => (
                <button className='argo-button argo-button--base' onClick={async () => {
                    const confirmed = await popupApi.confirm('Do it!', 'Are you sure?');
                    action(`Confirmed`)(confirmed);
                }}>Click me</button>
            )}
        </App>
    ));
