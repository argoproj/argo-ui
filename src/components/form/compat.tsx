// React 19 compatibility layer replacing deprecated react-form while preserving form APIs.
import * as React from 'react';

export type FormValues = Record<string, any>;
export type RenderReturn = React.ReactNode;
export type ValidateValuesFunction = (values: FormValues) => Record<string, any>;

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
}

export interface FieldProps {
    field: string;
    formApi?: FormApi;
    qeid?: string;
}

interface FormProps {
    defaultValues?: FormValues;
    validateError?: ValidateValuesFunction;
    onSubmit?: (vals: FormValues) => any;
    getApi?: (api: FormApi) => void;
    children: (api: FormApi) => RenderReturn;
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

        const fieldApi: FieldApi = {
            getValue: () => formApi.values[field],
            setValue: (value) => {
                formApi.values = {...formApi.values, [field]: value};
                formApi.touched = {...formApi.touched, [field]: true};
                formApi.errors = {...formApi.errors, [field]: undefined};
                formApi.setError(field, undefined);
            },
            setTouched: (touched) => {
                formApi.touched = {...formApi.touched, [field]: touched};
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

    const api = React.useMemo<FormApi>(() => ({
        values,
        touched,
        errors,
        submitForm: (e?: React.SyntheticEvent) => {
            if (e) {
                e.preventDefault();
            }
            const nextErrors = props.validateError ? props.validateError(values) || {} : {};
            setErrors(nextErrors);
            const hasError = Object.values(nextErrors).some(Boolean);
            if (!hasError && props.onSubmit) {
                props.onSubmit(values);
            }
        },
        setError: (field: string, error: any) => {
            setErrors((current) => ({...current, [field]: error}));
        },
    }), [errors, props, touched, values]);

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
    }), [api, errors, touched, values]);

    React.useEffect(() => {
        if (props.getApi) {
            props.getApi(proxiedApi);
        }
    }, [props, proxiedApi]);

    return <FormContext.Provider value={proxiedApi}>{props.children(proxiedApi)}</FormContext.Provider>;
}
