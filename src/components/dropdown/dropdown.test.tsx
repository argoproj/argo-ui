import * as React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {DropDown} from './dropdown';

function renderDropdown(onSelect: () => void) {
    return render(
        <DropDown anchor={() => <button id='anchor'>anchor</button>} isMenu={true}>
            <ul>
                <li onClick={onSelect}>first</li>
                <li>second</li>
            </ul>
        </DropDown>
    );
}

describe('DropDown', () => {
    test('selects the first item when pressing Enter inside an open dropdown', async () => {
        const onSelect = jest.fn();
        renderDropdown(onSelect);

        await userEvent.click(screen.getByText('anchor'));

        const firstItem = screen.getByText('first');
        fireEvent.keyDown(firstItem, {key: 'Enter'});

        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    test('ignores Enter when the dropdown is closed', () => {
        const onSelect = jest.fn();
        renderDropdown(onSelect);

        fireEvent.keyDown(document, {key: 'Enter'});

        expect(onSelect).not.toHaveBeenCalled();
    });

    test('ignores Enter when the target is outside the dropdown', async () => {
        const onSelect = jest.fn();
        renderDropdown(onSelect);

        await userEvent.click(screen.getByText('anchor'));

        const outside = document.createElement('div');
        document.body.appendChild(outside);
        try {
            fireEvent.keyDown(outside, {key: 'Enter'});
            expect(onSelect).not.toHaveBeenCalled();
        } finally {
            outside.remove();
        }
    });

    test('closes an already open dropdown when a sibling dropdown is opened', async () => {
        render(
            <React.Fragment>
                <DropDown anchor={() => <button>first anchor</button>} isMenu={true}>
                    <ul><li>first menu</li></ul>
                </DropDown>
                <DropDown anchor={() => <button>second anchor</button>} isMenu={true}>
                    <ul><li>second menu</li></ul>
                </DropDown>
            </React.Fragment>
        );
        const contentOf = (item: string) => screen.getByText(item).closest('.argo-dropdown__content');

        await userEvent.click(screen.getByText('first anchor'));
        expect(contentOf('first menu')).toHaveClass('opened');

        await userEvent.click(screen.getByText('second anchor'));
        expect(contentOf('second menu')).toHaveClass('opened');
        expect(contentOf('first menu')).not.toHaveClass('opened');
    });
});
