import * as React from 'react';
import { Input } from '../../index';

import '../../antd.less';

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
    return (
        <React.Fragment>
            <div style={{width: '50%', marginBottom: '1em'}}>
                <Input {...args} />
            </div>
        </React.Fragment>
    );
};

Primary.args = {
    placeholder: 'Type something here',
};
