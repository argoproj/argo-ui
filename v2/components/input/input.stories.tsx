import * as React from 'react';
import Text from '../text/text';
import {Input, useInput} from './input';

export default {
    title: 'Components/Input',
    component: Input,
    argTypes: {
        style: {control: {disable: true}},
        innerref: {control: {disable: true}},
        placeholder: {control: {type: 'text'}},
        onChange: {action: 'inputChanged'},
    },
};

export const Primary = (args: any) => {
    const [field, , fieldProps] = useInput('');
    const origOnChange = fieldProps.onChange;
    fieldProps.onChange = (val) => {
        origOnChange(val);
        args.onChange(val);
    };
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Input {...args} {...fieldProps} />
            </div>
            {field && field !== '' && <Text>Your input: {field}</Text>}
        </React.Fragment>
    );
};

Primary.args = {
    placeholder: 'Type something here',
};
