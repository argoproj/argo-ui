import * as React from 'react';

export const Flexy = (props: {noAlignment?: boolean; children: React.ReactNode}) => {
    return <div style={{display: 'flex', alignItems: `${props.noAlignment ? 'inherit' : 'center'}`}}>{props.children}</div>;
};
