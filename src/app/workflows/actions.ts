import { Dispatch } from 'redux';
import { Observable } from 'rxjs';

import { NotificationType } from '../shared/components';
import { AppState, commonActions } from '../shared/redux';
import { services } from '../shared/services';
import { ACTION_TYPES } from './reducers';
import { State } from './state';

function ensureUnsubscribed(getState: () => AppState<State>) {
    const state = getState();
    if (state.page.changesSubscription) {
        state.page.changesSubscription.unsubscribe();
    }
}

export function loadWorkflowsList(phases: string[]): any {
    return async (dispatch: Dispatch<any>, getState: () => AppState<State>) => {
        dispatch({ type: ACTION_TYPES.WORKFLOWS_LOAD_REQUEST });
        try {
            const workflows = (await services.workflows.list(phases));
            let events = services.workflows.watch();
            if (phases.length > 0) {
                events = events.filter((event) => phases.indexOf(event.object.status.phase) > -1);
            }
            ensureUnsubscribed(getState);
            const changesSubscription = events.subscribe((watchEvent) => {
                dispatch({ type: ACTION_TYPES.WORKFLOWS_CHANGED, workflowChange: watchEvent });
            });
            dispatch({ type: ACTION_TYPES.WORKFLOWS_LOAD_SUCCESS, workflows, changesSubscription });
        } catch (e) {
            dispatch(commonActions.showNotification({
                content: 'Unable to load workflows',
                type: NotificationType.Error,
            }));
        }
    };
}

export function loadWorkflow(namespace: string, name: string): any {
    return async (dispatch: Dispatch<any>, getState: () => AppState<State>) => {
        dispatch({ type: ACTION_TYPES.WORKFLOW_LOAD_REQUEST });
        try {
            const workflowUpdates = Observable
                .from([await services.workflows.get(namespace, name)])
                .merge(services.workflows.watch({name, namespace}).map((changeEvent) => changeEvent.object));
            const changesSubscription = workflowUpdates.subscribe((workflow) => {
                dispatch({ type: ACTION_TYPES.WORKFLOW_LOAD_SUCCESS, workflow, changesSubscription });
            });
        } catch (e) {
            dispatch(commonActions.showNotification({
                content: 'Unable to load workflow',
                type: NotificationType.Error,
            }));
        }
    };
}
