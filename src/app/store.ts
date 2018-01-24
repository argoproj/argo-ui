import { applyMiddleware, createStore } from 'redux';

import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import reducer from './reducer';

export const history = createHistory();
const middleware = routerMiddleware(history);

export const store = createStore(reducer,  applyMiddleware(middleware));
