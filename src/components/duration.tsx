import * as React from 'react';

import { formatDuration } from '../../v2';

/**
 * Output a string duration from a number of seconds
 *
 * @param {number} props.durationS - The number of seconds.
 * @param {number} props.durationMs - The number of seconds. DEPRECATED: The "Ms" suffix is incorrect, use props.durationS instead.
 */
export function Duration(props: {durationMs: number, durationS: number}) {
    return <span>{formatDuration(props.durationMs || props.durationS)}</span>;
}
