// React 19 compatibility layer replacing deprecated react-form while preserving form APIs.
import * as React from 'react';

export type FormValues = Record<string, any>;
export type FormErrors = Record<string, any>;
export type FormValue = any;
export type RenderReturn = React.ReactNode;
export type ValidateValuesFunction = (values: FormValues) => FormErrors;
// Legacy type aliases
export type Nested<T> = T;
export type FormFunctionProps = FormApi;

export interface FieldApi {
    getValue(): any;
    setValue(value: any): void;
    setTouched(touched: boolean): void;
}

export interface FormState {
    values: FormValues;
    touched: Record<string, any>;
    errors: FormErrors;
}

export interface FormApi {
    values: FormValues;
    touched: Record<string, any>;
    errors: FormErrors;
    submitForm(e?: React.SyntheticEvent | any): void;
    setError(field: Path, error: any): void;
    getFormState(): FormState;
    setFormState(state: Partial<FormState>): void;
    setAllValues(values: FormValues): void;
    setValue(field: Path, value: any): void;
    setTouched(field: Path, touched: boolean): void;
    resetAll(): void;
}

export interface FieldProps {
    field: Path;
    formApi?: FormApi;
    qeid?: string;
}

interface FormProps {
    defaultValues?: FormValues;
    validateError?: ValidateValuesFunction;
    onSubmit?: (vals: FormValues, event?: React.SyntheticEvent | any, api?: FormApi) => any;
    onSubmitFailure?: (errors: FormErrors) => any;
    preSubmit?: (vals: FormValues) => FormValues;
    getApi?: (api: FormApi) => void;
    formDidUpdate?: (state: FormState) => any;
    children: (api: FormApi) => RenderReturn;
}

const FormContext = React.createContext<FormApi | null>(null);

// Field paths accept the same forms as react-form:
//   - dotted strings:           'spec.source.repoURL'
//   - bracket-indexed strings:  'resources[0]', 'spec.destinations[0].server'
//   - array of keys:            ['window.applications', 0]  (dotted entries are still split)
export type Path = string | Array<string | number>;

function parsePath(path: Path): Array<string | number> {
    const segments = Array.isArray(path) ? path : [path];
    const keys: Array<string | number> = [];
    for (const segment of segments) {
        if (typeof segment === 'number') {
            keys.push(segment);
            continue;
        }
        // Split 'a.b[0].c' / 'a.b' / 'a[0][1]' into individual keys.
        let buf = '';
        for (let i = 0; i < segment.length; i++) {
            const ch = segment[i];
            if (ch === '.') {
                if (buf) {
                    keys.push(buf);
                    buf = '';
                }
            } else if (ch === '[') {
                if (buf) {
                    keys.push(buf);
                    buf = '';
                }
                const end = segment.indexOf(']', i + 1);
                const idx = segment.slice(i + 1, end === -1 ? segment.length : end);
                const n = Number(idx);
                keys.push(Number.isFinite(n) && /^\d+$/.test(idx) ? n : idx);
                i = end === -1 ? segment.length : end;
            } else {
                buf += ch;
            }
        }
        if (buf) {
            keys.push(buf);
        }
    }
    return keys;
}

function cloneContainer(value: any, nextKey: string | number): any {
    const wantsArray = typeof nextKey === 'number';
    if (Array.isArray(value)) {
        return value.slice();
    }
    if (value != null && typeof value === 'object') {
        return {...value};
    }
    return wantsArray ? [] : {};
}

function deepSet(obj: Record<string, any>, path: Path, value: any): Record<string, any> {
    const keys = parsePath(path);
    if (keys.length === 0) return obj;
    const rootIsArray = Array.isArray(obj);
    const result: any = rootIsArray ? (obj as any).slice() : {...obj};
    let cursor: any = result;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        cursor[key] = cloneContainer(cursor[key], nextKey);
        cursor = cursor[key];
    }
    cursor[keys[keys.length - 1]] = value;
    return result;
}

function deepGet(obj: Record<string, any>, path: Path): any {
    const keys = parsePath(path);
    let cursor: any = obj;
    for (const key of keys) {
        if (cursor == null) return undefined;
        cursor = cursor[key];
    }
    return cursor;
}

function withFieldApi(
    Component: React.ComponentType<any>,
): React.ComponentType<any> {
    return function FieldConnectedComponent(props: any) {
        const contextApi = React.useContext(FormContext);
        const propApi = (props as {formApi?: FormApi}).formApi;
        const formApi = propApi || contextApi;
        const field = (props as {field: Path}).field;

        if (!formApi) {
            throw new Error('FormField components must be used inside <Form> or be passed formApi');
        }

        const fieldApi: FieldApi = {
            getValue: () => deepGet(formApi.values, field),
            setValue: (value) => {
                formApi.setValue(field, value);
            },
            setTouched: (touched) => {
                formApi.setTouched(field, touched);
            },
        };

        return <Component {...props} fieldApi={fieldApi} />;
    };
}

export function FormField(
    component: React.ComponentType<any>,
): React.ComponentType<any> {
    return withFieldApi(component);
}

export const Text = FormField((props: React.InputHTMLAttributes<HTMLInputElement> & FieldProps & {fieldApi: FieldApi}) => {
    const {fieldApi, onBlur, onChange, field: _field, formApi: _formApi, ...rest} = props as any;
    const value = fieldApi.getValue() ?? '';

    return (
        <input
            {...rest}
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                fieldApi.setValue(event.currentTarget.value);
                if (onChange) {
                    onChange(event);
                }
            }}
            onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                fieldApi.setTouched(true);
                if (onBlur) {
                    onBlur(event);
                }
            }}
        />
    );
});

export const TextArea = FormField((props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps & {fieldApi: FieldApi}) => {
    const {fieldApi, onBlur, onChange, field: _field, formApi: _formApi, ...rest} = props as any;
    const value = fieldApi.getValue() ?? '';

    return (
        <textarea
            {...rest}
            value={value}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                fieldApi.setValue(event.currentTarget.value);
                if (onChange) {
                    onChange(event);
                }
            }}
            onBlur={(event: React.FocusEvent<HTMLTextAreaElement>) => {
                fieldApi.setTouched(true);
                if (onBlur) {
                    onBlur(event);
                }
            }}
        />
    );
});

export const Checkbox = FormField((props: React.InputHTMLAttributes<HTMLInputElement> & FieldProps & {fieldApi: FieldApi}) => {
    const {fieldApi, onBlur, onChange, field: _field, formApi: _formApi, ...rest} = props as any;
    const checked = !!fieldApi.getValue();

    return (
        <input
            {...rest}
            type='checkbox'
            checked={checked}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                fieldApi.setValue(event.currentTarget.checked);
                if (onChange) {
                    onChange(event);
                }
            }}
            onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                fieldApi.setTouched(true);
                if (onBlur) {
                    onBlur(event);
                }
            }}
        />
    );
});

// NestedForm is a legacy wrapper that scoped fields under a prefix key.
// In practice it is always wrapping a standalone <Form> with its own state,
// so rendering children directly is sufficient.
export function NestedForm({children}: {field: string; children: React.ReactNode}) {
    return <>{children}</>;
}

export function Form(props: FormProps) {
    const [values, setValues] = React.useState<FormValues>(props.defaultValues || {});
    const [touched, setTouched] = React.useState<Record<string, any>>({});
    const [errors, setErrors] = React.useState<FormErrors>({});

    const defaultValuesRef = React.useRef<FormValues>(props.defaultValues || {});

    // Refs so callbacks always read the latest state without stale closures
    const valuesRef = React.useRef(values);
    const touchedRef = React.useRef(touched);
    const errorsRef = React.useRef(errors);
    const propsRef = React.useRef(props);
    valuesRef.current = values;
    touchedRef.current = touched;
    errorsRef.current = errors;
    propsRef.current = props;

    const proxiedApiRef = React.useRef<FormApi | null>(null);

    const submitForm = React.useCallback((e?: React.SyntheticEvent | any) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        const currentValues = valuesRef.current;
        const nextErrors = propsRef.current.validateError ? propsRef.current.validateError(currentValues) || {} : {};
        setErrors(nextErrors);

        const fields = Object.keys(nextErrors);
        if (fields.length > 0) {
            setTouched((prev) => fields.reduce((acc, f) => deepSet(acc, f, true), prev));
        }

        const hasError = Object.values(nextErrors).some(Boolean);
        if (hasError) {
            if (propsRef.current.onSubmitFailure) {
                propsRef.current.onSubmitFailure(nextErrors);
            }
        } else if (propsRef.current.onSubmit) {
            const submitValues = propsRef.current.preSubmit ? propsRef.current.preSubmit(currentValues) : currentValues;
            propsRef.current.onSubmit(submitValues, e, proxiedApiRef.current ?? undefined);
        }
    }, []);

    const proxiedApi = React.useMemo<FormApi>(() => ({
        get values() {
            return valuesRef.current;
        },
        set values(nextValues: FormValues) {
            setValues(nextValues);
        },
        get touched() {
            return touchedRef.current;
        },
        set touched(nextTouched: Record<string, any>) {
            setTouched(nextTouched);
        },
        get errors() {
            return errorsRef.current;
        },
        set errors(nextErrors: FormErrors) {
            setErrors(nextErrors);
        },
        submitForm,
        setError(field: Path, error: any) {
            setErrors((current) => deepSet(current, field, error));
        },
        getFormState(): FormState {
            return {values: valuesRef.current, touched: touchedRef.current, errors: errorsRef.current};
        },
        setFormState(state: Partial<FormState>) {
            if (state.values !== undefined) setValues(state.values);
            if (state.touched !== undefined) setTouched(state.touched);
            if (state.errors !== undefined) setErrors(state.errors);
        },
        setAllValues(nextValues: FormValues) {
            setValues(nextValues);
        },
        setValue(field: Path, value: any) {
            setValues((prev) => deepSet(prev, field, value));
            setTouched((prev) => deepSet(prev, field, true));
        },
        setTouched(field: Path, isTouched: boolean) {
            setTouched((prev) => deepSet(prev, field, isTouched));
        },
        resetAll() {
            setValues(defaultValuesRef.current);
            setErrors({});
            setTouched({});
        },
    }), [submitForm]);

    proxiedApiRef.current = proxiedApi;

    React.useEffect(() => {
        if (props.getApi) {
            props.getApi(proxiedApi);
        }
    // Only re-run when proxiedApi changes (stable after mount)
    }, [proxiedApi]);

    React.useEffect(() => {
        if (propsRef.current.formDidUpdate) {
            propsRef.current.formDidUpdate({values, touched, errors});
        }
    }, [values, touched, errors]);

    return <FormContext.Provider value={proxiedApi}>{props.children(proxiedApi)}</FormContext.Provider>;
}
