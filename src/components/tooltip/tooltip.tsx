import Tippy, { TippyProps } from '@tippy.js/react';
import * as React from 'react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

export const Tooltip = ( props: TippyProps ) => (
    <Tippy animation='fade' appendTo={document.body}  theme='light' interactive={true} {...props} />
);
