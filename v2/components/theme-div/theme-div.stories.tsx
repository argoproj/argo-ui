import * as React from 'react';
import ActionButton from '../action-button/action-button';
import {Flexy} from '../flexy/flexy';
import Text from '../text/text';
import {Theme, ThemeDiv} from './theme-div';

export default {
    component: ThemeDiv,
    title: 'Components/ThemeDiv',
    argTypes: {
        innerref: {control: {disable: true}},
    },
};

export const Primary = (args: any) => {
    const [theme, setTheme] = React.useState(Theme.Light);
    React.useEffect(() => {
        setTheme(args.theme as Theme);
    }, [args.theme]);
    const toggleTheme = () => setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark);
    const style = {background: theme === Theme.Dark ? 'black' : 'white', padding: '1em'};
    return (
        <ThemeDiv theme={theme} {...args} className='test' style={style}>
            <Flexy>
                <ActionButton action={toggleTheme} theme={theme} icon={theme === Theme.Dark ? 'fa-sun' : 'fa-moon'} />
                <Text theme={theme}>
                    Classes: <code>{theme === Theme.Dark ? 'test test--dark' : 'test'}</code>
                </Text>
            </Flexy>
        </ThemeDiv>
    );
};
