import { from, Observable } from 'rxjs';

export function isPromise<T>(obj: any): obj is PromiseLike<T> {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export const Utils = {
    getScrollParent(el: HTMLElement): HTMLElement {
        const regex = /(auto|scroll)/;
        while (el.parentNode) {
            el = el.parentNode as HTMLElement;
            const overflow = getComputedStyle(el, null).getPropertyValue('overflow') +
            getComputedStyle(el, null).getPropertyValue('overflow-y') +
            getComputedStyle(el, null).getPropertyValue('overflow-x');
            if (regex.test(overflow)) {
                return el;
            }
        }
        return document.body;
    },

    scrollTo(element: HTMLElement, to: number, duration = 1000) {
        function easeInOutQuad(t: number, b: number, c: number, d: number) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t + b;
            }

            t--;
            return -c / 2 * ( t * ( t - 2 ) - 1) + b;
        }
        const start = element.scrollTop;
        const change = to - start;
        let currentTime = 0;
        const increment = 20;

        const animateScroll = () => {
            currentTime += increment;
            element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    },

    toObservable<T>(val: T | Observable<T> | Promise<T>): Observable<T> {
        const observable = val as Observable<T>;
        if (observable && observable.subscribe && observable.forEach) {
            return observable as Observable<T>;
        }
        return from([val as T]);
    },
};
