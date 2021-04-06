import * as React from 'react';

import './text.scss';

export const Text = (props: {children: string | string[]}) => {
    return <div className='text'>{props.children}</div>;
};

export default Text;
