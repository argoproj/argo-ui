import * as React from 'react';

import { formatDuration } from '../../v2';

export function Duration(props: {durationMs: number}) {
    return <span>{formatDuration(props.durationMs / 1000)}</span>;
}
