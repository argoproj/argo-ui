import { Store, withState } from '@dump247/storybook-state';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Text } from 'react-form';

import { Checkbox, FormField } from '../src/components';
import { App } from './utils';

storiesOf('Popup', module)
    .add('confirmation', () => (
        <App>
            {(apis) => (
                <button className='argo-button argo-button--base' onClick={async () => {
                    const confirmed = await apis.popup.confirm('Do it!', 'Are you sure?');
                    action(`Confirmed`)(confirmed);
                }}>Click me</button>
            )}
        </App>
    )).add('confirmation with custom form inside',  withState({ checked: false })(({store}: { store: Store<any> }) => (
            <App>
                {(apis) => (
                    <div>
                    <button className='argo-button argo-button--base' onClick={async () => {
                        const confirmed = await apis.popup.confirm('Do it!', () => (
                            <div>
                                Click checkbox and confirm <Checkbox checked={store.state.checked} onChange={(val) => store.set({ checked: val })} />
                            </div>
                        ));
                        action('Confirmed')(confirmed);
                    }}>Click me</button>
                    <p>Checked?: {JSON.stringify(store.state.checked)}</p>
                    </div>
                )}
            </App>
        ),
    )).add('prompt', () => (
        <App>
            {(apis) => (
                <button className='argo-button argo-button--base' onClick={async () => {
                    const values = await apis.popup.prompt('Enter name', (api) => (
                        <React.Fragment>
                        <div className='argo-form-row'>
                            <FormField label='First Name' formApi={api} field='firstName' component={Text} />
                        </div>
                        <div className='argo-form-row'>
                            <FormField label='Last Name' formApi={api} field='lastName' component={Text} />
                        </div>
                        </React.Fragment>
                    ), { validate: (vals) => ({
                            firstName: !vals.firstName && 'First Name is required',
                            lastName: !vals.lastName && 'Last Name is required',
                    })});

                    action('Prompt values')(values);
                }}>Click me</button>
            )}
        </App>
    )).add('prompt with custom submit', () => (
        <App>
            {(apis) => (
                <button className='argo-button argo-button--base' onClick={() => {
                    apis.popup.prompt('Username: test Password: test', (api) => (
                        <React.Fragment>
                        <div className='argo-form-row'>
                            <FormField label='Username' formApi={api} field='username' component={Text} />
                        </div>
                        <div className='argo-form-row'>
                            <FormField label='Password' formApi={api} field='password' component={Text} componentProps={{type: 'password'}} />
                        </div>
                        </React.Fragment>
                    ), {
                        validate: (vals) => ({
                            username: !vals.username && 'Username is required',
                            password: !vals.password && 'Password is required',
                        }),
                        submit: (vals, api, close) => {
                            if (vals.username === 'test' && vals.password === 'test') {
                                close();
                                action('Prompt values')(vals);
                            } else {
                                api.setError('password', 'Username or password is invalid');
                            }
                        },
                    });
                }}>Click me</button>
            )}
        </App>
    ));
