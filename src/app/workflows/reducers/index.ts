import { combineReducers } from 'redux';

import workflowsList from './workflows-list';

export default combineReducers({
    workflowsList,
});

export * from './action-types';
