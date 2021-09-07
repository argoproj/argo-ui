import * as React from 'react';
import {Flexy} from '../flexy/flexy';
import Text from '../text/text';
import ThemeDiv from '../theme-div/theme-div';

interface TickerProps {
    value: number;
}

/**
 * Ticker
 */
export const Ticker = (props: TickerProps) => {
    const [cur, setCur] = React.useState(props.value);
    const [delta, setDelta] = React.useState(0);

    React.useEffect(() => {
        setDelta(cur - props.value);
        setCur(props.value);
    }, [props.value]);
    return (
        <ThemeDiv>
            <Flexy>
                <i className={`fa ${delta > 0 ? 'fa-arrow-down' : 'fa-arrow-up'}`} style={{marginRight: '5px'}} />
                <Text>{props.value}</Text>
            </Flexy>
        </ThemeDiv>
    );
};
