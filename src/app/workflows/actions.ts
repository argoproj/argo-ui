import { Dispatch } from 'redux';

import { AppState } from '../shared/redux';
import { services } from '../shared/services';
import { ACTION_TYPES } from './reducers';
import { State } from './state';

export function loadWorkflowsList(phases: string[]): any {
    return async (dispatch: Dispatch<any>, getState: () => AppState<State>) => {
        const state = getState();
        if (state.page.changesSubscription) {
            state.page.changesSubscription.unsubscribe();
        }
        dispatch({ type: ACTION_TYPES.WORKFLOWS_LOAD_REQUEST });
        const workflows = (await services.workflows.list(phases)).items;
        let events = services.workflows.watch();
        if (phases.length > 0) {
            events = events.filter((event) => phases.indexOf(event.object.status.phase) > -1);
        }
        const changesSubscription = events.subscribe((watchEvent) => {
            dispatch({ type: ACTION_TYPES.WORKFLOWS_CHANGED, workflowChange: watchEvent });
        });
        dispatch({ type: ACTION_TYPES.WORKFLOWS_LOAD_SUCCESS, workflows, changesSubscription });
    };
}
