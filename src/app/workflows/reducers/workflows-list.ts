import { WorkflowsListState } from '../components/workflows-list';
import { ACTION_TYPES } from './action-types';

export default function(state: WorkflowsListState = { workflows: null }, action: any) {
    switch (action.type) {
        case ACTION_TYPES.WORKFLOWS_LOAD_REQUEST:
            return {...state, workflows: null };
        case ACTION_TYPES.WORKFLOWS_LOAD_SUCCESS:
            return {...state, workflows: action.workflows };
    }
    return state;
}
