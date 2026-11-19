import * as React from 'react';
import {act, render, screen, fireEvent} from '@testing-library/react';
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
});

describe('DropDown positioning', () => {
    // jsdom has no layout: window.innerHeight is 768 and element sizes are 0 unless stubbed.
    let resizeCallback: ResizeObserverCallback | undefined;
    const observe = jest.fn();
    const disconnect = jest.fn();
    const originalResizeObserver = global.ResizeObserver;

    beforeEach(() => {
        resizeCallback = undefined;
        observe.mockClear();
        disconnect.mockClear();
        global.ResizeObserver = jest.fn((callback: ResizeObserverCallback) => {
            resizeCallback = callback;
            return {observe, disconnect, unobserve: jest.fn()};
        }) as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        global.ResizeObserver = originalResizeObserver;
    });

    function renderMenu() {
        const result = render(
            <DropDown anchor={() => <button>anchor</button>} isMenu={true}>
                <ul>
                    <li>item</li>
                </ul>
            </DropDown>
        );
        const anchor = document.querySelector('.argo-dropdown__anchor') as HTMLElement;
        const content = document.querySelector('.argo-dropdown__content') as HTMLElement;
        return {...result, anchor, content};
    }

    function setAnchorTop(anchor: HTMLElement, top: number) {
        jest.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({top, left: 10, bottom: top + 20, right: 50, width: 40, height: 20, x: 10, y: top, toJSON: () => ({})});
    }

    function setContentHeight(content: HTMLElement, offsetHeight: number, scrollHeight = offsetHeight) {
        Object.defineProperty(content, 'offsetHeight', {configurable: true, value: offsetHeight});
        Object.defineProperty(content, 'scrollHeight', {configurable: true, value: scrollHeight});
    }

    function resize() {
        act(() => resizeCallback?.([], {} as ResizeObserver));
    }

    test('moves the menu above the anchor when its content grows after opening', async () => {
        const {anchor, content} = renderMenu();
        setAnchorTop(anchor, 700);

        await userEvent.click(screen.getByText('anchor'));
        expect(observe).toHaveBeenCalledWith(content);
        expect(content.style.top).toBe('702px');

        setContentHeight(content, 300);
        resize();

        expect(content.style.top).toBe('398px');
        expect(content.style.maxHeight).toBe('');
    });

    test('limits the height and scrolls below the anchor when the menu fits neither below nor above', async () => {
        const {anchor, content} = renderMenu();
        setAnchorTop(anchor, 300);
        setContentHeight(content, 600);

        await userEvent.click(screen.getByText('anchor'));

        expect(content.style.top).toBe('302px');
        expect(content.style.maxHeight).toBe('466px');
        expect(content.style.overflowY).toBe('auto');
    });

    test('limits the height and scrolls above the anchor when there is more space above', async () => {
        const {anchor, content} = renderMenu();
        setAnchorTop(anchor, 600);
        setContentHeight(content, 700);

        await userEvent.click(screen.getByText('anchor'));

        expect(content.style.top).toBe('0px');
        expect(content.style.maxHeight).toBe('598px');
    });

    test('keeps the height limit while the content still does not fit', async () => {
        const {anchor, content} = renderMenu();
        setAnchorTop(anchor, 300);
        setContentHeight(content, 600);
        await userEvent.click(screen.getByText('anchor'));

        // The rendered height is now limited, but the content still needs 600px.
        setContentHeight(content, 466, 600);
        resize();

        expect(content.style.top).toBe('302px');
        expect(content.style.maxHeight).toBe('466px');
    });

    test('removes the height limit once the content fits', async () => {
        const {anchor, content} = renderMenu();
        setAnchorTop(anchor, 300);
        setContentHeight(content, 600);
        await userEvent.click(screen.getByText('anchor'));

        setContentHeight(content, 100);
        resize();

        expect(content.style.top).toBe('302px');
        expect(content.style.maxHeight).toBe('');
        expect(content.style.overflowY).toBe('');
    });

    test('stops observing the content when the menu closes', async () => {
        renderMenu();
        await userEvent.click(screen.getByText('anchor'));

        await userEvent.click(document.body);

        expect(disconnect).toHaveBeenCalled();
    });

    test('stops observing the content when unmounted', async () => {
        const {unmount} = renderMenu();
        await userEvent.click(screen.getByText('anchor'));

        unmount();

        expect(disconnect).toHaveBeenCalled();
    });

    test('opens when ResizeObserver is not available', async () => {
        global.ResizeObserver = undefined as unknown as typeof ResizeObserver;
        renderMenu();

        await userEvent.click(screen.getByText('anchor'));

        expect(screen.getByText('item')).toBeInTheDocument();
    });
});
