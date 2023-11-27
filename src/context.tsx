import * as H from 'history';
import { UIMatch} from 'react-router';
import { NotificationsApi, PopupApi } from './components';

export interface AppContext {
    router: {
        history: H.History;
        route: {
            location: H.Location;
            match: UIMatch<any>;
        };
    };
    apis: {
        popup: PopupApi;
        notifications: NotificationsApi;
    };
    history: H.History;
}
