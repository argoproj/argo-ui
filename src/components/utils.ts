import { from, Observable } from 'rxjs';

export function isPromise<T>(obj: any): obj is PromiseLike<T> {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export const Utils = {
    toObservable<T>(val: T | Observable<T> | Promise<T>): Observable<T> {
        const observable = val as Observable<T>;
        if (observable && observable.subscribe && observable.forEach) {
            return observable as Observable<T>;
        }
        return from([val as T]);
    },
};
