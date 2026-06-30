import * as React from 'react';
import {useTheme} from '../../shared/context/theme';

export enum Theme {
    Light = 'light',
    Dark = 'dark',
}

/**
 * Automatically appends `--dark` to all classes on the div when `theme` prop is set to `Theme.Dark`
 */
export const ThemeDiv = (
    props: {
        children?: React.ReactNode;
        disabled?: boolean;
        innerref?: React.LegacyRef<any>;
        theme?: Theme;
        className?: string;
    } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
    const contextTheme = useTheme();
    const theme = props.theme || contextTheme;
    const {innerref, children, ...rest} = props;
    let clString = props.className;

    if (theme === Theme.Dark && !props.disabled) {
        const cl = (clString || '').split(' ') || [];
        const darkCl = [];
        for (const c of cl) {
            if (!c.endsWith('--dark')) {
                darkCl.push(c + '--dark');
            }
        }
        clString = `${cl.join(' ')} ${darkCl.join(' ')}`;
    }

    return (
        <div {...(rest as any)} className={clString} ref={innerref}>
            {children}
        </div>
    );
};

export default ThemeDiv;
