import { action } from '@storybook/addon-actions';
import * as React from 'react';
import { Checkbox as ReactCheckbox } from 'react-form';
import { Text } from 'react-form';

import { Checkbox } from '../src/components/checkbox';
import { FormField } from '../src/components/form-field/form-field';
import { App } from './utils';

export default {
    title: 'Popup',
};

export const Confirmation = () => (
    <App>
        {(apis) => (
            <button className='argo-button argo-button--base' onClick={async () => {
                const confirmed = await apis.popup.confirm('Do it!', 'Are you sure?');
                action(`Confirmed`)(confirmed);
            }}>Click me</button>
        )}
    </App>
);
Confirmation.story = {
    name: 'confirmation',
};

export const ConfirmationWithCustomFormInside = () => {
    const [checked, setChecked] = React.useState(false);
    return (
        <App>
            {(apis) => (
                <div>
                    <button className='argo-button argo-button--base' onClick={async () => {
                        const confirmed = await apis.popup.confirm('Do it!', () => (
                            <div>
                                Click checkbox and confirm <Checkbox checked={checked} onChange={setChecked} />
                            </div>
                        ));
                        action('Confirmed')(confirmed);
                    }}>Click me</button>
                    <p>Checked?: {JSON.stringify(checked)}</p>
                </div>
            )}
        </App>
    )
};
ConfirmationWithCustomFormInside.story = {
    name: 'confirmation with custom form inside',
};

export const Prompt = () => (
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
);
Prompt.story = {
    name: 'prompt',
};

export const PromptWithCustomSubmit = () => (
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
);
PromptWithCustomSubmit.story = {
    name: 'prompt with custom submit',
};

export const PromptWithRedTitleAndIconWithCustomSubmit = () => (
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
                },
                { name: 'argo-icon-warning', color: 'failed' },
                'red');
            }}>Click me</button>
        )}
    </App>
);
PromptWithRedTitleAndIconWithCustomSubmit.story = {
    name: 'prompt with red title and icon, with custom submit',
};

export const PromptWithYellowTitleAndIconThreeFieldsAndCustomSubmitVerticalCenterLayoutOfIcon = () => (
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
                        <div className='argo-form-row'>
                            <FormField label='Re-enter password' formApi={api} field='password' component={Text} componentProps={{type: 'password'}} />
                        </div>
                        <h4>This is an h4 header</h4>
                        <p>This is a paragraph</p>
                        <h4>This is another h4 header</h4>
                        <p>This is a paragraph</p>
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
                },
                { name: 'argo-icon-workflow', color: 'warning' },
                'yellow');
            }}>Click me</button>
        )}
    </App>
);
PromptWithYellowTitleAndIconThreeFieldsAndCustomSubmitVerticalCenterLayoutOfIcon.story = {
    name: 'prompt with yellow title and icon, three fields and custom submit.  Vertical center layout of icon',
};

export const PromptWithGreenClockIconAndCustomSubmit = () => (
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
                },
                { name: 'argo-icon-clock', color: 'success' });
            }}>Click me</button>
        )}
    </App>
);
PromptWithGreenClockIconAndCustomSubmit.story = {
    name: 'prompt with green clock icon and custom submit',
};

export const PromptWithJustHeadersAndParagraphs = () => (
    <App>
        {(apis) => (
            <button className='argo-button argo-button--base' onClick={async () => {
                const values = await apis.popup.prompt('Enter name', (api) => (
                    <div>
                        <h4>This is an h4 header</h4>
                        <p>This is a paragraph</p>
                        <h4>This is another h4 header</h4>
                        <p>This is a paragraph</p>
                    </div>
                ));
                action('Prompt values')(values);
            }}>Click me</button>
        )}
    </App>
);
PromptWithJustHeadersAndParagraphs.story = {
    name: 'prompt with just headers and paragraphs',
};

export const PromptWithOnlyParagraphsAdditionalTopPaddingIsOptionalForTheFirstParagraph = () => (
    <App>
        {(apis) => (
            <button className='argo-button argo-button--base' onClick={async () => {
                const values = await apis.popup.prompt('Enter name', (api) => (
                    <div>
                        <p style={{ paddingTop: '20px' }}>This is a paragraph</p>
                        <p>This is another paragraph</p>
                    </div>
                ));
                action('Prompt values')(values);
            }}>Click me</button>
        )}
    </App>
);
PromptWithOnlyParagraphsAdditionalTopPaddingIsOptionalForTheFirstParagraph.story = {
    name: 'prompt with only paragraphs. Additional top padding is optional for the first paragraph',
};

export const PromptWithReactCheckboxThatIsCheckedByDefaultUsernameDefaultSetToAdmin = () => (
    <App>
        {(apis) => (
            <button className='argo-button argo-button--base' onClick={async () => {
                const values = await apis.popup.prompt('Setting default values in popup example', (api) => (
                    <React.Fragment>
                        <div className='argo-form-row'>
                            <FormField label='Username' formApi={api} field='username' component={Text} />
                        </div>
                        <div className='argo-form-row'>
                            <FormField label='Password' formApi={api} field='password' component={Text} componentProps={{ type: 'password' }} />
                        </div>
                        <div className='argo-form-row'>
                            <ReactCheckbox id='popup-react-checkbox' field='checkboxField' />{' '}
                            <label htmlFor='popup-react-checkbox'>This is a React Checkbox</label>
                        </div>
                    </React.Fragment>
                ), {
                    validate: (vals) => ({
                        username: !vals.username && 'Username is required',
                        password: !vals.password && 'Password is required',
                    }),
                    submit: (vals, api, close) => {
                        if (vals.username === 'admin' && vals.password === 'test') {
                            close();
                            action('Prompt values')(vals);
                        } else {
                            api.setError('password', 'Username or password is invalid');
                        }
                    },
                },
                undefined,
                undefined,
                { checkboxField: true, username: 'admin' });
                action('Prompt values')(values);
            }}>Click me</button>
        )}
    </App>
);
PromptWithReactCheckboxThatIsCheckedByDefaultUsernameDefaultSetToAdmin.story = {
    name: 'prompt with React Checkbox that is checked by default; Username default set to admin',
};
