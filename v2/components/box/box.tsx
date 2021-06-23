import * as React from 'react';

import {ThemeDiv} from '../theme-div/theme-div';

import './box.scss';

export const Box = (props: {children: React.ReactNode}) => {
    return <ThemeDiv className='argo-box'>{props.children}</ThemeDiv>;
};

export const BoxTitle = (props: {children: React.ReactNode}) => {
    return <ThemeDiv className='argo-box__title'>{props.children}</ThemeDiv>;
};
