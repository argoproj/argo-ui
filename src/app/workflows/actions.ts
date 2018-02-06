import { Dispatch } from 'redux';

import { AppState } from '../shared/redux';
import { services } from '../shared/services';
import { ACTION_TYPES } from './reducers';
import { State } from './state';

export function loadWorkflowsList(phases: string[]): any {
    return async (dispatch: Dispatch<any>, getState: () => AppState<State>) => {
        dispatch({ type: ACTION_TYPES.WORKFLOWS_LOAD_REQUEST });
        const workflows = (await services.workflows.list(phases)).items;
        dispatch({ type: ACTION_TYPES.WORKFLOWS_LOAD_SUCCESS, workflows });
    };
}
