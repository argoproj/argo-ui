import * as React from 'react';
import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {Form, Text, TextArea, Checkbox, FormField, NestedForm, FormApi, FieldApi, FieldProps} from './compat';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderSimpleForm(formProps: Partial<React.ComponentProps<typeof Form>> = {}, defaultValues: Record<string, any> = {}) {
    let capturedApi!: FormApi;
    const onSubmit = jest.fn();
    const result = render(
        <Form defaultValues={defaultValues} onSubmit={onSubmit} getApi={(api) => { capturedApi = api; }} {...formProps}>
            {(api) => (
                <>
                    <Text field='name' data-testid='name-input' />
                    <button onClick={() => api.submitForm()}>Submit</button>
                </>
            )}
        </Form>
    );
    return {...result, onSubmit, getApi: () => capturedApi};
}

// ---------------------------------------------------------------------------
// Form — basic rendering
// ---------------------------------------------------------------------------

describe('Form', () => {
    test('1: renders children via render prop', () => {
        render(
            <Form>
                {() => <span data-testid='child'>hello</span>}
            </Form>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    test('2: defaultValues populates Text field', () => {
        renderSimpleForm({}, {name: 'Alice'});
        expect(screen.getByTestId('name-input')).toHaveValue('Alice');
    });

    test('3: typing into Text field updates formApi.values', async () => {
        const {getApi} = renderSimpleForm();
        await userEvent.type(screen.getByTestId('name-input'), 'Bob');
        expect(getApi().values.name).toBe('Bob');
    });

    test('4: blurring a Text field sets touched[field]=true', async () => {
        const {getApi} = renderSimpleForm();
        const input = screen.getByTestId('name-input');
        await userEvent.click(input);
        await userEvent.tab(); // moves focus away, triggers blur
        expect(getApi().touched.name).toBe(true);
    });

    test('5: submitForm calls onSubmit with current values', async () => {
        const {onSubmit} = renderSimpleForm({}, {name: 'Carol'});
        await userEvent.click(screen.getByText('Submit'));
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({name: 'Carol'}), undefined, expect.objectContaining({submitForm: expect.any(Function)}));
    });

    test('6: validateError with errors calls onSubmitFailure, not onSubmit', async () => {
        const onSubmit = jest.fn();
        const onSubmitFailure = jest.fn();
        render(
            <Form
                onSubmit={onSubmit}
                onSubmitFailure={onSubmitFailure}
                validateError={() => ({name: 'required'})}>
                {(api) => <button onClick={() => api.submitForm()}>Submit</button>}
            </Form>
        );
        await userEvent.click(screen.getByText('Submit'));
        expect(onSubmitFailure).toHaveBeenCalledWith({name: 'required'});
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('7: validateError returning no errors allows onSubmit', async () => {
        const onSubmit = jest.fn();
        render(
            <Form onSubmit={onSubmit} validateError={() => ({})}>
                {(api) => <button onClick={() => api.submitForm()}>Submit</button>}
            </Form>
        );
        await userEvent.click(screen.getByText('Submit'));
        expect(onSubmit).toHaveBeenCalled();
    });

    test('8: preSubmit transforms values before onSubmit', async () => {
        const onSubmit = jest.fn();
        render(
            <Form
                defaultValues={{name: 'dave'}}
                onSubmit={onSubmit}
                preSubmit={(vals) => ({...vals, name: vals.name.toUpperCase()})}>
                {(api) => <button onClick={() => api.submitForm()}>Submit</button>}
            </Form>
        );
        await userEvent.click(screen.getByText('Submit'));
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({name: 'DAVE'}), undefined, expect.objectContaining({submitForm: expect.any(Function)}));
    });

    test('9: getApi exposes FormApi with expected methods', () => {
        const {getApi} = renderSimpleForm();
        const api = getApi();
        expect(typeof api.submitForm).toBe('function');
        expect(typeof api.setValue).toBe('function');
        expect(typeof api.resetAll).toBe('function');
        expect(typeof api.getFormState).toBe('function');
    });

    test('10: formDidUpdate fires when values change', async () => {
        const formDidUpdate = jest.fn();
        renderSimpleForm({formDidUpdate});
        await userEvent.type(screen.getByTestId('name-input'), 'x');
        expect(formDidUpdate).toHaveBeenCalled();
        const lastCall = formDidUpdate.mock.calls[formDidUpdate.mock.calls.length - 1][0];
        expect(lastCall.values.name).toContain('x');
    });

    test('11: resetAll reverts to defaultValues', async () => {
        const {getApi} = renderSimpleForm({}, {name: 'Eve'});
        await userEvent.clear(screen.getByTestId('name-input'));
        await userEvent.type(screen.getByTestId('name-input'), 'Frank');
        act(() => getApi().resetAll());
        expect(screen.getByTestId('name-input')).toHaveValue('Eve');
        expect(getApi().values.name).toBe('Eve');
    });

    test('12: setAllValues replaces entire values object', () => {
        const {getApi} = renderSimpleForm();
        act(() => getApi().setAllValues({name: 'Grace', extra: 42}));
        expect(getApi().values).toEqual({name: 'Grace', extra: 42});
        expect(screen.getByTestId('name-input')).toHaveValue('Grace');
    });

    test('13: setError adds field error visible in formApi.errors', () => {
        const {getApi} = renderSimpleForm();
        act(() => getApi().setError('name', 'too short'));
        expect(getApi().errors.name).toBe('too short');
    });

    test('14: setFormState updates values, touched, and errors together', () => {
        const {getApi} = renderSimpleForm();
        act(() => getApi().setFormState({
            values: {name: 'Hank'},
            touched: {name: true},
            errors: {name: 'bad'},
        }));
        const state = getApi().getFormState();
        expect(state.values.name).toBe('Hank');
        expect(state.touched.name).toBe(true);
        expect(state.errors.name).toBe('bad');
    });

    test('15: nested dot-notation field path set and retrieved correctly', () => {
        let capturedApi!: FormApi;
        render(
            <Form getApi={(api) => { capturedApi = api; }}>
                {() => <Text field='spec.source.repoURL' data-testid='repo-input' />}
            </Form>
        );
        act(() => capturedApi.setValue('spec.source.repoURL', 'https://example.com'));
        expect(capturedApi.values.spec.source.repoURL).toBe('https://example.com');
        expect(screen.getByTestId('repo-input')).toHaveValue('https://example.com');
    });

    test('16: TextArea setValue and setTouched on blur', async () => {
        let capturedApi!: FormApi;
        render(
            <Form getApi={(api) => { capturedApi = api; }}>
                {() => <TextArea field='notes' data-testid='notes-input' />}
            </Form>
        );
        await userEvent.type(screen.getByTestId('notes-input'), 'hello');
        expect(capturedApi.values.notes).toBe('hello');
        await userEvent.tab();
        expect(capturedApi.touched.notes).toBe(true);
    });

    test('17: Checkbox field converts checked to boolean via fieldApi', async () => {
        let capturedApi!: FormApi;
        render(
            <Form defaultValues={{active: false}} getApi={(api) => { capturedApi = api; }}>
                {() => <Checkbox field='active' data-testid='active-cb' />}
            </Form>
        );
        expect(screen.getByTestId('active-cb')).not.toBeChecked();
        await userEvent.click(screen.getByTestId('active-cb'));
        expect(capturedApi.values.active).toBe(true);
        expect(screen.getByTestId('active-cb')).toBeChecked();
    });

    test('18: FormField HOC passes fieldApi to wrapped component', () => {
        let receivedFieldApi: FieldApi | undefined;
        const Probe = FormField((props: FieldProps & {fieldApi: FieldApi}) => {
            receivedFieldApi = props.fieldApi;
            return null;
        });
        render(
            <Form defaultValues={{x: 'test'}}>
                {() => <Probe field='x' />}
            </Form>
        );
        expect(receivedFieldApi).toBeDefined();
        expect(typeof receivedFieldApi!.getValue).toBe('function');
        expect(receivedFieldApi!.getValue()).toBe('test');
    });

    test('19: FormField outside Form without formApi prop throws', () => {
        const Probe = FormField((_props: FieldProps & {fieldApi?: FieldApi}) => null);
        // Suppress React's error boundary console output in test
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<Probe field='x' />)).toThrow('FormField components must be used inside <Form> or be passed formApi');
        spy.mockRestore();
    });

    test('20: submitForm calls e.preventDefault when passed event', async () => {
        let capturedApi!: FormApi;
        render(
            <Form getApi={(api) => { capturedApi = api; }} onSubmit={jest.fn()}>
                {() => null}
            </Form>
        );
        const mockEvent = {preventDefault: jest.fn()};
        act(() => capturedApi.submitForm(mockEvent));
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// NestedForm — legacy no-op
// ---------------------------------------------------------------------------

describe('NestedForm', () => {
    test('21: renders children unchanged', () => {
        render(<NestedForm field='ignored'><span data-testid='nested-child'>ok</span></NestedForm>);
        expect(screen.getByTestId('nested-child')).toBeInTheDocument();
    });
});
