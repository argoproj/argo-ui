import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Observable } from 'rxjs';

import { LogsViewer } from '../src/components';

storiesOf('LogsViewer', module).add('default', () => (
  <div>
    <LogsViewer source={{
        key: 'test',
        loadLogs: () => new Observable<string>((observer) => {
            const interval = setInterval(() => observer.next('test\n'), 1000);
            return () => clearInterval(interval);
        }),
        shouldRepeat: () => false,
    }}/>
  </div>
));
