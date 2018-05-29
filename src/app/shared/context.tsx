import * as H from 'history';
import { match} from 'react-router';

export interface AppContext {
    router: {
        history: H.History;
        route: {
            location: H.Location;
            match: match<any>;
        };
    };
}
