import * as React from 'react';
import {Ticker} from './ticker';

export default {
    component: Ticker,
    title: 'Components/Ticker',
    argTypes: {
        value: {control: {type: 'number'}},
    },
};

export const Primary = (args: any) => {
    const [randVal, setRandVal] = React.useState(0);

    React.useEffect(() => {
        const to = setTimeout(() => {
            setRandVal(Math.round((Math.random() * 10) % 10));
            return () => clearInterval(to);
        }, 2000);
    });
    return <Ticker value={randVal} />;
};
