import * as React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {Autocomplete, AutocompleteApi} from './autocomplete';

const ITEMS = ['apple', 'banana', 'cherry', 'apricot'];

function renderAutocomplete(props: Partial<React.ComponentProps<typeof Autocomplete>> = {}) {
    return render(<Autocomplete items={ITEMS} {...props} />);
}

describe('Autocomplete', () => {
    test('1: renders input; menu hidden when closed', () => {
        renderAutocomplete();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('2: opens menu on input click showing all items', async () => {
        renderAutocomplete();
        await userEvent.click(screen.getByRole('combobox'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.getAllByRole('option')).toHaveLength(ITEMS.length);
    });

    test('3: filters suggestions while typing when filterSuggestions=true', async () => {
        renderAutocomplete({filterSuggestions: true});
        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.clear(input);
        await userEvent.type(input, 'ap');
        // 'apple' and 'apricot' match 'ap'
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveTextContent('apple');
        expect(options[1]).toHaveTextContent('apricot');
    });

    test('4: shows all items when filterSuggestions is not set (default behaviour)', async () => {
        renderAutocomplete();
        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.type(input, 'ap');
        expect(screen.getAllByRole('option')).toHaveLength(ITEMS.length);
    });

    test('5: onSelect fires with correct value on item click', async () => {
        const onSelect = jest.fn();
        renderAutocomplete({onSelect});
        await userEvent.click(screen.getByRole('combobox'));
        const options = screen.getAllByRole('option');
        await userEvent.click(options[1]); // 'banana'
        expect(onSelect).toHaveBeenCalledWith('banana', expect.objectContaining({value: 'banana'}));
    });

    test('6: onChange fires on keystroke with event and value', async () => {
        const onChange = jest.fn();
        renderAutocomplete({onChange});
        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.type(input, 'b');
        expect(onChange).toHaveBeenCalledWith(expect.any(Object), expect.stringContaining('b'));
    });

    test('7: controlled value — prop change updates input', () => {
        const {rerender} = renderAutocomplete({value: 'apple'});
        expect(screen.getByRole('combobox')).toHaveValue('apple');
        rerender(<Autocomplete items={ITEMS} value='banana' />);
        expect(screen.getByRole('combobox')).toHaveValue('banana');
    });

    test('8: autoHighlight=false — no item has selected class on open', async () => {
        renderAutocomplete({autoHighlight: false});
        await userEvent.click(screen.getByRole('combobox'));
        const options = screen.getAllByRole('option');
        options.forEach((opt) => expect(opt).not.toHaveClass('selected'));
    });

    test('9: renderItem custom renderer output appears in menu', async () => {
        renderAutocomplete({
            renderItem: (item) => <span data-testid='custom-item'>{item.value.toUpperCase()}</span>,
        });
        await userEvent.click(screen.getByRole('combobox'));
        const customItems = screen.getAllByTestId('custom-item');
        expect(customItems).toHaveLength(ITEMS.length);
        expect(customItems[0]).toHaveTextContent('APPLE');
    });

    test('10: renderInput custom renderer replaces default input', () => {
        renderAutocomplete({
            renderInput: (inputProps) => <input {...inputProps} data-testid='custom-input' />,
        });
        expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });

    test('11: string items auto-converted and displayed correctly', async () => {
        render(<Autocomplete items={['foo', 'bar']} />);
        await userEvent.click(screen.getByRole('combobox'));
        const options = screen.getAllByRole('option');
        expect(options[0]).toHaveTextContent('foo');
        expect(options[1]).toHaveTextContent('bar');
    });

    test('12: autoCompleteRef receives object with refresh method', () => {
        let api: AutocompleteApi | undefined;
        renderAutocomplete({autoCompleteRef: (ref) => { api = ref; }});
        expect(api).toBeDefined();
        expect(typeof api!.refresh).toBe('function');
    });

    test('13: menu hidden when filterSuggestions=true and no items match', async () => {
        renderAutocomplete({filterSuggestions: true});
        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.clear(input);
        await userEvent.type(input, 'zzz');
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('14: object items with label use label as display text', async () => {
        render(<Autocomplete items={[{value: 'v1', label: 'Label One'}, {value: 'v2', label: 'Label Two'}]} />);
        await userEvent.click(screen.getByRole('combobox'));
        const options = screen.getAllByRole('option');
        expect(options[0]).toHaveTextContent('Label One');
        expect(options[1]).toHaveTextContent('Label Two');
    });

    test('15: object items without label fall back to value', async () => {
        render(<Autocomplete items={[{value: 'only-value'}]} />);
        await userEvent.click(screen.getByRole('combobox'));
        expect(screen.getByRole('option')).toHaveTextContent('only-value');
    });
});

describe('Autocomplete menu position when the list height changes', () => {
    const ROW_HEIGHT = 30;
    const INPUT_RECT = {top: 500, bottom: 530, left: 10, right: 210, width: 200, height: ROW_HEIGHT, x: 10, y: 500, toJSON: () => ({})} as DOMRect;
    const EMPTY_RECT = {top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({})} as DOMRect;
    const KINDS = ['secret', 'service', 'serviceaccount', 'statefulset', 'storageclass', 'replicaset', 'daemonset', 'node'];
    const originalInnerHeight = window.innerHeight;

    beforeEach(() => {
        // The input sits near the bottom of a short viewport, so the menu has to open upward.
        // jsdom does not do layout, so fake the geometry that Autocomplete reads.
        Object.defineProperty(window, 'innerHeight', {configurable: true, value: 540});
        jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
            return this.tagName === 'INPUT' ? INPUT_RECT : EMPTY_RECT;
        });
        jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
            if (this.tagName === 'INPUT') {
                return ROW_HEIGHT;
            }
            if (this.getAttribute('role') === 'listbox') {
                return this.querySelectorAll('[role="option"]').length * ROW_HEIGHT;
            }
            return 0;
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        Object.defineProperty(window, 'innerHeight', {configurable: true, value: originalInnerHeight});
    });

    // Upward position is: input top - menu height - input height
    test('16: an upward-opening menu stays anchored to the input when filtering shrinks and grows the list', async () => {
        render(<Autocomplete items={KINDS} filterSuggestions={true} />);
        const input = screen.getByRole('combobox');

        await userEvent.click(input);
        expect(screen.getAllByRole('option')).toHaveLength(8);
        expect(screen.getByRole('listbox').style.top).toBe('230px'); // 500 - 8*30 - 30

        await userEvent.type(input, 'sec'); // only "secret" matches
        expect(screen.getAllByRole('option')).toHaveLength(1);
        expect(screen.getByRole('listbox').style.top).toBe('440px'); // 500 - 1*30 - 30

        await userEvent.clear(input);
        expect(screen.getAllByRole('option')).toHaveLength(8);
        expect(screen.getByRole('listbox').style.top).toBe('230px');
    });
});
