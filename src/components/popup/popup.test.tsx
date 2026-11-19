import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import * as React from 'react';

import {SlidingPanel} from '../sliding-panel/sliding-panel';
import {PopupManager} from './popup-manager';
import {Popup, PopupProps} from './popup';

const TestPopup = ({onResult}: {onResult: (result: unknown) => void}) => {
    const [isPanelShown, setPanelShown] = React.useState(true);
    const [popupProps, setPopupProps] = React.useState<PopupProps | null>(null);
    const [popupManager] = React.useState(() => new PopupManager());

    React.useEffect(() => {
        const subscription = popupManager.popupProps.subscribe(setPopupProps);
        return () => subscription.unsubscribe();
    }, [popupManager]);

    return (
        <>
            <SlidingPanel isShown={isPanelShown} onClose={() => setPanelShown(false)}>
                <button onClick={() => popupManager.prompt('Delete resource', () => <textarea aria-label='Resource name' />).then(onResult)}>Delete</button>
            </SlidingPanel>
            {popupProps && <Popup {...popupProps} />}
        </>
    );
};

test('dismisses a popup before its sliding panel', async () => {
    const onResult = jest.fn();
    render(<TestPopup onResult={onResult} />);

    const trigger = screen.getByRole('button', {name: 'Delete'});
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', {name: 'Delete resource'});
    trigger.focus();

    fireEvent.keyDown(trigger, {key: 'Escape', keyCode: 27});
    expect(dialog).toHaveFocus();
    expect(document.querySelector('.sliding-panel')).toHaveClass('sliding-panel--opened');

    fireEvent.keyDown(dialog, {key: 'Escape', keyCode: 27, repeat: true});
    expect(dialog).toBeInTheDocument();
    expect(onResult).not.toHaveBeenCalled();
    fireEvent.keyUp(dialog, {key: 'Escape', keyCode: 27});

    const input = screen.getByRole('textbox', {name: 'Resource name'});
    input.focus();
    fireEvent.keyDown(input, {key: 'Escape', keyCode: 27});

    expect(dialog).not.toBeInTheDocument();
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(null));
    expect(onResult).toHaveBeenCalledTimes(1);
    const panelBody = document.querySelector<HTMLElement>('.sliding-panel__body');
    expect(panelBody).toHaveFocus();
    expect(document.querySelector('.sliding-panel')).toHaveClass('sliding-panel--opened');

    fireEvent.keyDown(panelBody!, {key: 'Escape', keyCode: 27, repeat: true});
    expect(document.querySelector('.sliding-panel')).toHaveClass('sliding-panel--opened');
    fireEvent.keyUp(panelBody!, {key: 'Escape', keyCode: 27});

    fireEvent.keyDown(panelBody!, {key: 'Escape', keyCode: 27});
    expect(document.querySelector('.sliding-panel')).not.toHaveClass('sliding-panel--opened');
});

test('does not consume Escape when onClose is not provided', () => {
    const closePanel = jest.fn();
    const panel = <SlidingPanel isShown={true} onClose={closePanel}>Panel</SlidingPanel>;
    const {rerender} = render(<>{panel}</>);
    const previouslyFocused = document.activeElement;

    rerender(<>
        {panel}
        <Popup title='Notice'>Content</Popup>
    </>);

    expect(previouslyFocused).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, {key: 'Escape', keyCode: 27});
    expect(closePanel).toHaveBeenCalledTimes(1);

    const dialog = screen.getByRole('dialog', {name: 'Notice'});
    dialog.focus();
    expect(fireEvent.keyDown(dialog, {key: 'Escape', keyCode: 27})).toBe(true);
});
