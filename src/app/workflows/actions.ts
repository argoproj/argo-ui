import { Dispatch } from 'redux';
import { AppState } from '../shared/redux';
import { services } from '../shared/services';
import { ACTION_TYPES } from './reducers';
import { State } from './state';

export function loadWorkflowsList(): any {
    return async (dispatch: Dispatch<any>, getState: () => AppState<State>) => {
        const state = getState().page.workflowsList;
        if (!state.workflows) {
            dispatch({ type: ACTION_TYPES.WORKFLOWS_LOAD_REQUEST });
            const workflows = (await services.workflows.all()).items;
            dispatch({ type: ACTION_TYPES.WORKFLOWS_LOAD_SUCCESS, workflows });
        }
    };
}
