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
    } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
    const theme = props.theme || useTheme();
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
        <div {...(props as any)} className={clString} ref={props.innerref}>
            {props.children}
        </div>
    );
};

export default ThemeDiv;
