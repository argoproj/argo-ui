import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { TopBar } from '../src/components/top-bar/top-bar';


storiesOf('TopBar', module)
    .add('basic tabs', () => (
        <TopBar title='My Title' toolbar={{}} />
    ))
    .add('with actions menu', () => (
        <TopBar title='My Title' toolbar={{ actionMenu: { items: [{ action: () => alert(' here' ), title: "click here" }] } }} />
    ))
    .add('with extension menu', () => (
        <TopBar title='My Title' toolbar={{ actionMenu: { items: [{ action: () => alert(' here' ), title: "click here" }] }, actionMenuExtensions: [<React.Fragment key={1}>render the custom component</React.Fragment>] }} />
    ));