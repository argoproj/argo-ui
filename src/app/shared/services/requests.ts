import * as _superagent from 'superagent';
const superagentPromise = require('superagent-promise');

const superagent: _superagent.SuperAgentStatic = superagentPromise(_superagent, global.Promise);

const API_ROOT = '/api';

export default {
    get<T>(url: string) {
        return superagent.get(`${API_ROOT}${url}`).then((res) => res.body as T);
    },
};
