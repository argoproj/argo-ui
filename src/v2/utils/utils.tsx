import * as React from 'react';
import * as moment from 'moment';

export function useServerData<T>(getData: () => Promise<T>) {
    const [data, setData] = React.useState({} as T);
    React.useEffect(() => {
        const fx = async () => {
            const data = await getData();
            setData(data);
        };
        fx();
    }, [getData]);
    return data as T;
}

export function formatTimestamp(ts: string): string {
    const inputFormat = 'YYYY-MM-DD HH:mm:ss Z z';
    const m = moment(ts, inputFormat);
    if (!ts || !m.isValid()) {
        return 'Never';
    }
    return m.format('MMM D YYYY [at] hh:mm:ss');
}

export const appendSuffixToClasses = (classNames: string, suffix: string): string => {
    let clString = classNames;
    const cl = (clString || '').split(' ') || [];
    const suffixed = [];
    for (const c of cl) {
        if (!c.endsWith(suffix) && c !== ' ' && c !== '') {
            suffixed.push(c + suffix);
        }
    }
    return suffixed.join(' ');
};

export const useClickOutside = (ref: any, callback: () => void) => {
    React.useEffect(() => {
        const handler = (e: any) => {
            if (ref.current && !ref.current.contains(e.target)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [ref, callback]);
};

export const useWidth = (ref: any): number => {
    const [width, setWidth] = React.useState(0);
    React.useEffect(() => {
        setWidth(ref.current ? ref.current.offsetWidth : 0);
    }, [ref]);
    return width;
};

export const useTimeout = (fx: () => void, timeoutMs: number, dependencies: any[]) => {
    React.useEffect(() => {
        const to = setTimeout(fx, timeoutMs);
        return () => clearInterval(to);
    }, dependencies);
};
