import { State } from './state';

export const ACTION_TYPES = {
    WORKFLOWS_LOAD_REQUEST: 'WORKFLOWS_LOAD_REQUEST',
    WORKFLOWS_LOAD_SUCCESS: 'WORKFLOWS_LOAD_SUCCESS',
};

export default function(state: State = { workflows: null }, action: any) {
    switch (action.type) {
        case ACTION_TYPES.WORKFLOWS_LOAD_REQUEST:
            return {...state, workflows: null };
        case ACTION_TYPES.WORKFLOWS_LOAD_SUCCESS:
            return {...state, workflows: action.workflows };
    }
    return state;
}
