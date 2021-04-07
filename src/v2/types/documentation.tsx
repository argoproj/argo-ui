import * as React from 'react';

export interface PropDoc {
    name: string;
    type: string;
    description: string;
    default?: string;
}

export interface ComponentDocs {
    props: PropDoc[];
    name: string;
    description: string;
}

export class DocumentedComponent<P> extends React.PureComponent<P> {
    docs: ComponentDocs;
}
