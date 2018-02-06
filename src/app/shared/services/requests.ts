import * as _superagent from 'superagent';
const superagentPromise = require('superagent-promise');

const superagent: _superagent.SuperAgentStatic = superagentPromise(_superagent, global.Promise);

const API_ROOT = '/api';

export default {
    get(url: string) {
        return superagent.get(`${API_ROOT}${url}`);
    },
};
