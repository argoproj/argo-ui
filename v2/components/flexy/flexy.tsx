import * as React from 'react';

export const Flexy = (props: {noAlignment?: boolean; onClick?: (e: any) => void; className?: string; style?: React.CSSProperties; children: React.ReactNode}) => {
    return (
        <div className={props.className} onClick={props.onClick} style={{...(props.style as any), display: 'flex', alignItems: `${props.noAlignment ? 'inherit' : 'center'}`}}>
            {props.children}
        </div>
    );
};
