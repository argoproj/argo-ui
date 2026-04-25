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
