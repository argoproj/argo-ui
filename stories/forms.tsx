import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Form, Text } from 'react-form';
import { FormField, FormSelect } from '../src/components';

storiesOf('Forms', module)
    .add('default', () => (
        <Form>
            {(api) => (
                <form style={{padding: '1em'}}>
                    <div className='argo-form-row'>
                        <FormField label='Textbox' formApi={api} field='textField' component={Text} />
                    </div>
                    <div className='argo-form-row'>
                        <FormField label='Password' formApi={api} field='passwordField' component={Text} componentProps={{type: 'password'}} />
                    </div>
                    <div className='argo-form-row'>
                        <FormField label='Select' formApi={api}  field='selectField' component={FormSelect} componentProps={{options: ['option1', 'option2']}} />
                    </div>
                </form>
            )}
        </Form>
    ));
