import * as React from 'react';

import { formatDuration } from '../../v2';

/**
 * Output a string duration from a number of seconds
 *
 * @param {number} props.durationS - The number of seconds.
 */
export function Duration(props: {durationS: number}) {
    return <span>{formatDuration(props.durationS, 2)}</span>;
}
