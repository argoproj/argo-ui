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

function isOpened(content: string) {
    return screen.getByText(content).closest('.argo-dropdown__content').classList.contains('opened');
}

describe('DropDown', () => {
    test('closes when clicking the anchor of an open dropdown', async () => {
        renderDropdown(jest.fn());

        await userEvent.click(screen.getByText('anchor'));
        expect(isOpened('first')).toBe(true);

        await userEvent.click(screen.getByText('anchor'));
        expect(isOpened('first')).toBe(false);
    });

    test('closes when the anchor closes open dropdowns on mousedown', async () => {
        render(
            <DropDown anchor={() => <a onMouseDown={() => document.body.click()}>anchor</a>}>
                <ul><li>first</li></ul>
            </DropDown>
        );

        await userEvent.click(screen.getByText('anchor'));
        expect(isOpened('first')).toBe(true);

        await userEvent.click(screen.getByText('anchor'));
        expect(isOpened('first')).toBe(false);
    });

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
});
