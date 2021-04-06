import * as React from 'react';

enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export const ThemeDiv = (
    props: {children?: React.ReactNode; disabled?: boolean; innerref?: React.MutableRefObject<any>; theme?: Theme} & React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >
) => {
    let theme = props.theme || Theme.Light;
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
        <div {...props} className={clString} ref={props.innerref}>
            {props.children}
        </div>
    );
};

export default ThemeDiv;
