import { WatchEvent, Workflow } from '../../models';
import { State } from './state';

export const ACTION_TYPES = {
    WORKFLOW_LOAD_REQUEST: 'WORKFLOW_LOAD_REQUEST',
    WORKFLOW_LOAD_SUCCESS: 'WORKFLOW_LOAD_SUCCESS',

    WORKFLOWS_LOAD_REQUEST: 'WORKFLOWS_LOAD_REQUEST',
    WORKFLOWS_LOAD_SUCCESS: 'WORKFLOWS_LOAD_SUCCESS',
    WORKFLOWS_CHANGED: 'WORKFLOWS_CHANGED',
};

function workflowListReducer(state: State = { }, action: any): State {
    switch (action.type) {
        case ACTION_TYPES.WORKFLOWS_LOAD_REQUEST:
            return {...state, workflows: null };
        case ACTION_TYPES.WORKFLOWS_LOAD_SUCCESS:
            return {...state, workflows: action.workflows, changesSubscription: action.changesSubscription };
        case ACTION_TYPES.WORKFLOWS_CHANGED:
            const workflowChange: WatchEvent<Workflow> = action.workflowChange;
            switch (workflowChange.type) {
                case 'ADDED':
                case 'MODIFIED':
                    const index = state.workflows.findIndex((item) => item.metadata.name === workflowChange.object.metadata.name);
                    if (index > -1) {
                        return {...state, workflows: [...state.workflows.slice(0, index), workflowChange.object, ...state.workflows.slice(index + 1)]};
                    } else {
                        return {...state, workflows: [workflowChange.object, ...state.workflows] };
                    }
                case 'DELETED':
                    return {...state, workflows: state.workflows.filter((item) => item.metadata.name !== workflowChange.object.metadata.name) };
            }
            break;
    }
    return state;
}

function workflowReducer(state: State = { }, action: any): State {
    switch (action.type) {
        case ACTION_TYPES.WORKFLOW_LOAD_REQUEST:
            return {...state, workflow: null };
        case ACTION_TYPES.WORKFLOW_LOAD_SUCCESS:
            return {...state, workflow: action.workflow };
    }
    return state;
}

export default function(state: State = { }, action: any): State {
    return workflowReducer(workflowListReducer(state, action), action);
}
