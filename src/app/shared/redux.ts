import * as H from 'history';
import { match } from 'react-router';
import { routerReducer, RouterState } from 'react-router-redux';
import { Reducer } from 'redux';

export interface AppState<S> {
    router?: RouterState;
    page?: S;
}

export interface AppContext {
    history: H.History;
    route: {
        location: H.Location;
        match: match<any>;
    };
}

export function getRoutesReducer(routes: {[path: string]: {reducer: Reducer<any>, component: React.ComponentClass | React.StatelessComponent} }) {
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
