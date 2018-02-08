import * as moment from 'moment';
import * as React from 'react';

export const Duration = (props: {durationMs: number, allowNewLines?: boolean}) => {
    const momentTimeStart = moment.utc(0);
    const momentTime = moment.utc(props.durationMs * 1000);
    const duration = moment.duration(momentTime.diff(momentTimeStart));
    let formattedTime = '';

    if (momentTime.diff(momentTimeStart, 'hours') === 0) {
        formattedTime = ('0' + duration.minutes()).slice(-2) + ':' + ('0' + duration.seconds()).slice(-2) + ' min';
    } else {
        if (momentTime.diff(momentTimeStart, 'days') > 0) {
            formattedTime += momentTime.diff(momentTimeStart, 'days') + ' days' + (props.allowNewLines ? '<br>' : ' ');
        }

        formattedTime += ('0' + duration.hours()).slice(-2) + ':' + ('0' + duration.minutes()).slice(-2) + ' hours';
    }
    return <span dangerouslySetInnerHTML={{__html: formattedTime}}/>;
};
