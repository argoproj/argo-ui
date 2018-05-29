import * as H from 'history';
import { match} from 'react-router';
import { NotificationsApi, PopupApi } from './components';

export interface AppContext {
    router: {
        history: H.History;
        route: {
            location: H.Location;
            match: match<any>;
        };
    };
    apis: {
        popup: PopupApi;
        notifications: NotificationsApi;
    };
    history: H.History;
}
