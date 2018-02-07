import { Subscription } from 'rxjs';

import * as models from '../../models';

export interface State {
    workflows?: models.Workflow[];
    changesSubscription?: Subscription;
}
