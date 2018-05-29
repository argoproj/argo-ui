import { Dispatch } from 'redux';
import { Observable } from 'rxjs';

import { NotificationType } from '../shared/components';
import { AppState, commonActions } from '../shared/redux';
import { services } from '../shared/services';
import { ACTION_TYPES } from './reducers';
import { State } from './state';

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
