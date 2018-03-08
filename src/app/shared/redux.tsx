import * as H from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, RouteComponentProps } from 'react-router';
import { routerReducer, RouterState } from 'react-router-redux';
import { Dispatch, Reducer } from 'redux';

import { NotificationInfo, Notifications } from './components';

export interface AppState<S> {
    router?: RouterState;
    notifications?: NotificationInfo[];
    page?: S;
}

export interface AppContext {
    router: {
        history: H.History;
        route: {
            location: H.Location;
            match: match<any>;
        };
    };
}

export interface RouteImplementation {
    reducer: Reducer<any>;
    component: React.ComponentType<RouteComponentProps<any>>;
}

export function isActiveRoute(locationPath: string, path: string) {
    return locationPath === path || locationPath.startsWith(`${path}/`);
}

export const asyncMiddleware = ({ dispatch, getState }: any) => (next: any) => (action: any) => {
    if (typeof action === 'function') {
        return action(dispatch, getState);
    }

    return next(action);
};

const ACTION_SHOW_NOTIFICATION = 'COMMON_SHOW_NOTIFICATION';
const ACTION_CLOSE_NOTIFICATION = 'COMMON_CLOSE_NOTIFICATION';

export function getReducer(routes: {[path: string]: RouteImplementation }) {
    return (state: AppState<any> = { notifications: [] }, action: any) => {
        const nextState = {...state};
        switch (action.type) {
            case ACTION_SHOW_NOTIFICATION:
                nextState.notifications = [...(state.notifications || []), action.notification];
                break;
            case ACTION_CLOSE_NOTIFICATION:
                const notifications = (state.notifications || []).slice();
                const index = state.notifications.indexOf(action.notification);
                if (index > -1) {
                    notifications.splice(index, 1);
                    nextState.notifications = notifications;
                }
                break;
            default:
                nextState.router = routerReducer(nextState.router, action);
                const locationPath = nextState.router
                    && nextState.router.location
                    && nextState.router.location.pathname || '';
                const pageReducerPath = Object.keys(routes).find((path) => isActiveRoute(locationPath, path));
                const pageReducer = pageReducerPath && routes[pageReducerPath];
                if (pageReducer) {
                    nextState.page = pageReducer.reducer(nextState.page, action);
                }
        }
        return nextState;
    };
}

export const commonActions = {
    showNotification(notification: NotificationInfo, autoHideMs = 5000): any {
        return async (dispatch: Dispatch<any>, getState: () => AppState<any>) => {
            dispatch({ type: ACTION_SHOW_NOTIFICATION, notification });
            if (autoHideMs > -1) {
                setTimeout(() => dispatch(commonActions.closeNotification(notification)), autoHideMs);
            }
        };
    },

    closeNotification(notification: NotificationInfo) {
        return { type: ACTION_CLOSE_NOTIFICATION, notification };
    },
};

export const NotificationsContainer = connect(
    (state: AppState<any>) => ({ notifications: state.notifications }),
    (dispatch: Dispatch<any>) => ({closeNotification: (notification: NotificationInfo) => dispatch(commonActions.closeNotification(notification))}))(
    (props: { notifications: NotificationInfo[], closeNotification: (notification: NotificationInfo) => any }) => (
        <Notifications leftOffset={60} closeNotification={props.closeNotification} notifications={props.notifications}/>
    ));
