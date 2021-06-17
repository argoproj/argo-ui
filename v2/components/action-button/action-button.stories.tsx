import * as React from 'react';
import Text from '../text/text';

import {ActionButton} from './action-button';

const IconOptions = ['fa-hand-point-up', 'fa-exclamation-circle'];

export default {
    title: 'Components/ActionButton',
    component: ActionButton,
    argTypes: {
        sampleAction: {
            name: 'Sample Action',
            description: 'A set of sample actions to demo the Action Button. Not available for real component',
            control: {
                type: 'radio',
                options: ['Say hello', 'Surprise'],
            },
        },
        action: {control: {disable: true}, description: 'Function that is called when button is clicked', action: 'clicked'},
        style: {control: {disable: true}},
        icon: {
            name: 'Sample Icon',
            description: 'A set of sample icons to choose from. For real component, use any FontAwesome class name.',
            options: IconOptions,
            mapping: IconOptions,
            control: {
                type: 'select',
                labels: {
                    faHandPointUp: 'Pointer',
                    faExclamationCircle: 'Error',
                },
            },
        },
        theme: {description: 'Takes precidence over dark boolean switch'},
        dark: {description: 'Convenience flag to make button appear dark without special Theme logic'},
        tooltip: {control: {type: 'text'}},
        short: {description: 'Displays only the icon (hides the label). Does nothing if icon is not specified'},
        indicateLoading: {description: 'Displays a spinner for a brief period on click, but only if the icon prop is set'},
        indicateSuccess: {description: 'Displays a checkmark after the specified action is complete, but only if the icon prop is set'},
    },
};

const Template = (args: any) => {
    const [message, setMessage] = React.useState('');
    const clickAction = args.action;

    const tempSetMessage = (text: string) => {
        clickAction();
        setMessage(text);
        setTimeout(() => {
            setMessage('');
        }, 1000);
    };

    const SampleActions: {[key: string]: () => void} = {
        'Say hello': () => tempSetMessage('Hello!'),
        'Surprise': () => tempSetMessage('Boo!'),
    };
    args.action = SampleActions[args.sampleAction];
    if (args.tooltip && args.tooltip !== '') {
        args.tooltip = <Text>{args.tooltip}</Text>;
    }

    return (
        <React.Fragment>
            <div style={{display: 'flex'}}>
                <ActionButton {...args} />
            </div>
            {message !== '' && (
                <div style={{marginTop: '1em'}}>
                    <Text dark={args.dark}>{message}</Text>
                </div>
            )}
        </React.Fragment>
    );
};

export const Primary = Template.bind({});

Primary.args = {
    label: 'Click me!',
    sampleAction: 'Say hello',
};
