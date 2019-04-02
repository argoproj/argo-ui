import Tippy from '@tippy.js/react';
import * as React from 'react';

export const Tooltip = ( props: any ) => <Tippy {...props} />;

Tooltip.defaultProps = {
  animation: 'fade',
  arrow: true,
};
