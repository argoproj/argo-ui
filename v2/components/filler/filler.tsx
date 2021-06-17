import * as React from 'react';

import {ThemeDiv} from '../theme-div/theme-div';

import './filler.scss';

export const Filler = (props: {children: React.ReactNode}) => <ThemeDiv className='filler'>{props.children}</ThemeDiv>;
