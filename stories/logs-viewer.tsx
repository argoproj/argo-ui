import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';

import { LogsViewer } from '../src/components';

const url = "a-very-long-url/"

const source = {
    key: '1',
    loadLogs: () => Observable.create(function(observer: Observer<string>) {
        observer.next('http://' + url.repeat(50) +'\n');
        observer.next('Hello World');
        observer.complete();
      }),
    shouldRepeat: () => false
}

storiesOf('Logs Viewer', module)
    .add('default', () => (
        <div style={{height:'300px'}}>
        <LogsViewer source={source} />
        </div>
    ));
