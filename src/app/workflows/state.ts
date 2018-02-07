import { Subscription } from 'rxjs';

import * as models from '../../models';

export interface State {
    workflows?: models.Workflow[];
    workflow?: models.Workflow;
    changesSubscription?: Subscription;
}
