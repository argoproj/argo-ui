// React 19 compatibility layer replacing deprecated react-form while preserving form APIs.
import * as React from 'react';

export type FormValues = Record<string, any>;
export type FormErrors = Record<string, any>;
export type FormValue = any;
export type RenderReturn = React.ReactNode;
export type ValidateValuesFunction = (values: FormValues) => Record<string, any>;
export type Nested<T> = T;

export type FormState = {
    values: FormValues;
    errors: FormErrors;
    touched: Record<string, boolean>;
};

export interface FieldApi {
    getValue(): any;
    setValue(value: any): void;
    setTouched(touched: boolean): void;
}

export interface FormApi {
    values: FormValues;
    touched: Record<string, boolean>;
    errors: Record<string, any>;
    submitForm(e?: React.SyntheticEvent): void;
    setError(field: string, error: any): void;
    setValue(field: string, value: any): void;
    getFormState(): FormState;
    setAllValues(values: FormValues): void;
    setTouched(field: string, touched: boolean): void;
    setFormState(state: Partial<FormState>): void;
    resetAll(): void;
}

export type FormFunctionProps = FormApi;

export interface FieldProps {
    field: string;
    formApi?: FormApi;
    qeid?: string;
}

interface FormProps {
    defaultValues?: FormValues;
    validateError?: ValidateValuesFunction;
    onSubmit?: (vals: FormValues, event?: React.SyntheticEvent, api?: FormApi) => any;
    onSubmitFailure?: (errors: FormErrors) => void;
    preSubmit?: (vals: FormValues) => FormValues;
    formDidUpdate?: (state: FormState) => void;
    getApi?: (api: FormApi) => void;
    children: (api: FormApi) => RenderReturn;
}

function setNestedField(obj: any, path: string, value: any): any {
    const [head, ...rest] = path.split('.');
    if (rest.length === 0) return {...obj, [head]: value};
    return {...obj, [head]: setNestedField(obj[head] ?? {}, rest.join('.'), value)};
}

const FormContext = React.createContext<FormApi | null>(null);

function withFieldApi(
    Component: React.ComponentType<any>,
): React.ComponentType<any> {
    return function FieldConnectedComponent(props: any) {
        const contextApi = React.useContext(FormContext);
        const propApi = (props as {formApi?: FormApi}).formApi;
        const formApi = propApi || contextApi;
        const field = (props as {field: string}).field;

        if (!formApi) {
            throw new Error('FormField components must be used inside <Form> or be passed formApi');
        }

        // Keep latest formApi in a ref so fieldApi callbacks are always fresh
        const formApiRef = React.useRef(formApi);
        formApiRef.current = formApi;

        const fieldApi = React.useMemo<FieldApi>(() => ({
            getValue: () => formApiRef.current.values[field],
            setValue: (value) => {
                formApiRef.current.values = {...formApiRef.current.values, [field]: value};
                formApiRef.current.touched = {...formApiRef.current.touched, [field]: true};
                formApiRef.current.errors = {...formApiRef.current.errors, [field]: undefined};
                formApiRef.current.setError(field, undefined);
            },
            setTouched: (touched) => {
                formApiRef.current.touched = {...formApiRef.current.touched, [field]: touched};
            },
        }), [field]); // stable unless the field name changes

        return <Component {...props} fieldApi={fieldApi} />;
    };
}

export function FormField(
    component: React.ComponentType<any>,
): React.ComponentType<any> {
    return withFieldApi(component);
}

export const Text = FormField((props: React.InputHTMLAttributes<HTMLInputElement> & FieldProps & {fieldApi: FieldApi}) => {
    const {fieldApi, onBlur, onChange, ...rest} = props;
    const value = fieldApi.getValue() ?? '';

    return (
        <input
            {...rest}
            value={value}
            onChange={(event) => {
                fieldApi.setValue(event.currentTarget.value);
                if (onChange) {
                    onChange(event);
                }
            }}
            onBlur={(event) => {
                fieldApi.setTouched(true);
                if (onBlur) {
                    onBlur(event);
                }
            }}
        />
    );
});

export const Checkbox = FormField((props: React.InputHTMLAttributes<HTMLInputElement> & FieldProps & {fieldApi: FieldApi}) => {
    const {fieldApi, onBlur, onChange, ...rest} = props;
    const checked = !!fieldApi.getValue();

    return (
        <input
            {...rest}
            type='checkbox'
            checked={checked}
            onChange={(event) => {
                fieldApi.setValue(event.currentTarget.checked);
                if (onChange) {
                    onChange(event);
                }
            }}
            onBlur={(event) => {
                fieldApi.setTouched(true);
                if (onBlur) {
                    onBlur(event);
                }
            }}
        />
    );
});

export function Form(props: FormProps) {
    const [values, setValues] = React.useState<FormValues>(props.defaultValues || {});
    const [touched, setTouched] = React.useState<Record<string, boolean>>({});
    const [errors, setErrors] = React.useState<Record<string, any>>({});

    const defaultValuesRef = React.useRef<FormValues>(props.defaultValues || {});
    const apiRef = React.useRef<FormApi | null>(null);

    // Callback refs — always current without triggering re-memoization
    const onSubmitRef = React.useRef(props.onSubmit);
    const onSubmitFailureRef = React.useRef(props.onSubmitFailure);
    const validateErrorRef = React.useRef(props.validateError);
    const preSubmitRef = React.useRef(props.preSubmit);
    const getApiRef = React.useRef(props.getApi);
    const formDidUpdateRef = React.useRef(props.formDidUpdate);

    React.useLayoutEffect(() => {
        onSubmitRef.current = props.onSubmit;
        onSubmitFailureRef.current = props.onSubmitFailure;
        validateErrorRef.current = props.validateError;
        preSubmitRef.current = props.preSubmit;
        getApiRef.current = props.getApi;
        formDidUpdateRef.current = props.formDidUpdate;
    });

    const api = React.useMemo<FormApi>(() => ({
        values,
        touched,
        errors,
        submitForm: (e?: React.SyntheticEvent) => {
            if (e) {
                e.preventDefault();
            }
            const nextErrors = validateErrorRef.current ? validateErrorRef.current(values) || {} : {};
            setErrors(nextErrors);
            const hasError = Object.values(nextErrors).some(Boolean);
            if (hasError) {
                if (onSubmitFailureRef.current) {
                    onSubmitFailureRef.current(nextErrors);
                }
            } else if (onSubmitRef.current) {
                const submitValues = preSubmitRef.current ? preSubmitRef.current(values) : values;
                onSubmitRef.current(submitValues, e, apiRef.current ?? undefined);
            }
        },
        resetAll: () => {
            setValues(defaultValuesRef.current);
            setErrors({});
            setTouched({});
        },
        setError: (field: string, error: any) => {
            setErrors((current) => ({...current, [field]: error}));
        },
        setValue: (field: string, value: any) => {
            setValues((current) => setNestedField(current, field, value));
            setTouched((current) => ({...current, [field]: true}));
        },
        getFormState: (): FormState => ({values, errors, touched}),
        setAllValues: (nextValues: FormValues) => {
            setValues(nextValues);
        },
        setTouched: (field: string, isTouched: boolean) => {
            setTouched((current) => ({...current, [field]: isTouched}));
        },
        setFormState: (state: Partial<FormState>) => {
            if (state.values !== undefined) setValues(state.values);
            if (state.errors !== undefined) setErrors(state.errors);
            if (state.touched !== undefined) setTouched(state.touched);
        },
    }), [errors, touched, values]); // props removed — callbacks accessed via refs

    const proxiedApi = React.useMemo<FormApi>(() => ({
        ...api,
        get values() {
            return values;
        },
        set values(nextValues: FormValues) {
            setValues(nextValues);
        },
        get touched() {
            return touched;
        },
        set touched(nextTouched: Record<string, boolean>) {
            setTouched(nextTouched);
        },
        get errors() {
            return errors;
        },
        set errors(nextErrors: Record<string, any>) {
            setErrors(nextErrors);
        },
        getFormState: (): FormState => ({values, errors, touched}),
    }), [api, errors, touched, values]);

    apiRef.current = proxiedApi;

    React.useEffect(() => {
        if (getApiRef.current) {
            getApiRef.current(proxiedApi);
        }
    }, [proxiedApi]); // props removed — use ref instead

    React.useEffect(() => {
        if (formDidUpdateRef.current) {
            formDidUpdateRef.current({values, errors, touched});
        }
    }, [values, errors, touched]);

    return <FormContext.Provider value={proxiedApi}>{props.children(proxiedApi)}</FormContext.Provider>;
}

export const TextArea = FormField((props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps & {fieldApi: FieldApi}) => {
    const {fieldApi, onBlur, onChange, ...rest} = props;
    const value = fieldApi.getValue() ?? '';

    return (
        <textarea
            {...rest}
            value={value}
            onChange={(event) => {
                fieldApi.setValue(event.currentTarget.value);
                if (onChange) {
                    onChange(event);
                }
            }}
            onBlur={(event) => {
                fieldApi.setTouched(true);
                if (onBlur) {
                    onBlur(event);
                }
            }}
        />
    );
});

export function NestedForm(props: {children: React.ReactNode; field?: string}) {
    return <div>{props.children}</div>;
}
