import * as React from 'react';
import {Theme, ThemeContext} from '../../shared/context/theme';
import {ActionButton} from '../action-button/action-button';

export const ThemeToggle = () => {
    const dmCtx = React.useContext(ThemeContext);
    const isDark = dmCtx.theme === Theme.Dark;
    const icon = isDark ? 'fa-sun' : 'fa-moon';
    return <ActionButton action={() => dmCtx.set(isDark ? Theme.Light : Theme.Dark)} icon={icon} dark={true} />;
};
