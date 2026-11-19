import * as React from 'react';
import {expect, userEvent, waitFor, within} from '@storybook/test';

import {Tooltip, TooltipProps} from '../src/components/tooltip/tooltip';

const meta = {
    title: 'Tooltip',
    component: Tooltip,
    args: {
        content: 'Hello there!',
        placement: 'top',
        arrow: true,
        children: <button type='button' className='argo-button argo-button--base'>Hover or focus me</button>,
    },
    argTypes: {
        content: {control: 'text'},
        placement: {control: 'select', options: ['top', 'right', 'bottom', 'left']},
        children: {control: false},
    },
    decorators: [
        function WithPadding(Story: React.ComponentType) {
            return <div style={{padding: '4em', width: 'fit-content'}}><Story /></div>;
        },
    ],
};

export default meta;

export const Default = (args: TooltipProps) => <Tooltip {...args} />;

export const RichContent = (args: TooltipProps) => <Tooltip {...args} />;
RichContent.args = {
    content: (
        <div>
            <strong>Argo UI</strong>
            <p style={{margin: '0.5em 0 0'}}>Tooltips can also display React elements.</p>
        </div>
    ),
};
RichContent.argTypes = {content: {control: false}};

export const ClickToChangeContent = (args: TooltipProps) => {
    const [alternate, setAlternate] = React.useState(false);

    return (
        <div>
            <Tooltip {...args} content={alternate ? 'Message' : 'First tooltip message'} hideOnClick={false}>
                <button type='button' className='argo-button argo-button--base' onClick={() => setAlternate(value => !value)}>
                    Toggle tooltip content
                </button>
            </Tooltip>
            <p style={{marginTop: '1em'}}>Click again to switch back. The tooltip stays open while its content changes.</p>
        </div>
    );
};
ClickToChangeContent.argTypes = {content: {control: false}};
ClickToChangeContent.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
    const canvas = within(canvasElement);
    // Tooltip content is portaled outside the story canvas.
    const body = within(canvasElement.ownerDocument.body);
    const button = canvas.getByRole('button', {name: 'Toggle tooltip content'});
    const expectPositionedContent = async (content: string) => {
        await waitFor(() => {
            const tooltip = body.getByRole('tooltip');
            expect(tooltip).toHaveTextContent(content);

            const tooltipBounds = tooltip.getBoundingClientRect();
            const buttonBounds = button.getBoundingClientRect();
            const placement = tooltip.getAttribute('data-placement');
            if (placement === 'top' || placement === 'bottom') {
                expect(Math.abs(tooltipBounds.left + tooltipBounds.width / 2 - buttonBounds.left - buttonBounds.width / 2)).toBeLessThan(2);
            } else if (placement === 'left' || placement === 'right') {
                expect(Math.abs(tooltipBounds.top + tooltipBounds.height / 2 - buttonBounds.top - buttonBounds.height / 2)).toBeLessThan(2);
            }
        });
    };

    await userEvent.hover(button);
    await expectPositionedContent('First tooltip message');

    await userEvent.click(button);
    await expectPositionedContent('Message');

    await userEvent.click(button);
    await expectPositionedContent('First tooltip message');
};
