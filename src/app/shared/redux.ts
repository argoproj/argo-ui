import { routerReducer, RouterState } from 'react-router-redux';
import { Reducer } from 'redux';

export interface AppState<S> {
    router?: RouterState;
    page?: S;
}

export function getRoutesReducer(routes: {[path: string]: {reducer: Reducer<any>, component: React.ComponentClass} }) {
    return (state: AppState<any> = {}, action: any) => {
        const nextState = {...state};
        nextState.router = routerReducer(nextState.router, action);
        const pageReducer = nextState.router
            && nextState.router.location
            && nextState.router.location.pathname
            && routes[nextState.router.location.pathname];
        if (pageReducer) {
            nextState.page = pageReducer.reducer(nextState.page, action);
        }
        return nextState;
    };
}
