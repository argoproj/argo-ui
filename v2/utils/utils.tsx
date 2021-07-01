import * as React from 'react';
import * as moment from 'moment';

export interface Error {
    state: boolean;
    retry: () => void;
}

export function useData<T>(getData: () => Promise<T>, init?: T, callback?: (data: T) => void, dependencies?: any[]): [T, boolean, Error] {
    const [data, setData] = React.useState(init as T);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [retrying, retry] = React.useState(false);
    React.useEffect(() => {
        const fx = async () => {
            try {
                setLoading(true);
                const data = await getData();
                setLoading(false);
                setData(data);
                if (callback) {
                    callback(data);
                }
            } catch (e) {
                setError(e);
            }
        };
        fx();
    }, [...(dependencies || []), retrying]);
    return [data as T, loading, {state: error, retry: () => retry(!retrying)} as Error];
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

export const debounce = (fxn: () => any, ms: number) => {
    let timer: any;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            fxn.apply(this);
        }, ms);
    };
};
