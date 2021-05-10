import {faMoon} from '@fortawesome/free-regular-svg-icons';
import {faSun} from '@fortawesome/free-solid-svg-icons';
import {ActionButton} from '../action-button/action-button';
import * as React from 'react';
import {Theme, ThemeContext} from '../../shared/context/theme';

export const ThemeToggle = () => {
    const dmCtx = React.useContext(ThemeContext);
    const isDark = dmCtx.theme === Theme.Dark;
    const icon = isDark ? faSun : faMoon;
    return <ActionButton action={() => dmCtx.set(isDark ? Theme.Light : Theme.Dark)} icon={icon} dark />;
};
