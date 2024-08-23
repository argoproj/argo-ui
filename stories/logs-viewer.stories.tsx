import * as React from 'react';
import { Observable } from 'rxjs';

import { LogsViewer } from '../src/components/logs-viewer/logs-viewer';

export default {
    title: 'LogsViewer',
};

export const Default = () => (
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
);
Default.storyName = 'default';
