import {default as classNames} from 'classnames';
import * as React from 'react';
import * as ReactForm from 'react-form';

import { Select as ArgoSelect, SelectOption, SelectProps } from '../select/select';

import { v1 as uuid } from 'uuid';

require('./form-field.scss');

export function getNestedField(src: any, path: string): any {
    const parts = path.split('.');
    while (parts.length > 0 && src) {
        src = src[parts.splice(0, 1)[0]];
    }
    return src;
}

export const FormField: <E, T extends ReactForm.FieldProps & { className?: string}>(
    props: React.Props<E> & {
        label?: string,
        field: string,
        formApi: ReactForm.FormApi,
        component: React.ComponentType<T>,
        componentProps?: T,
        qeId?: string;
    },
) => React.ReactElement<E> = (props) => {
    const [id] = React.useState(uuid());

    const FormComponent = props.component as React.ComponentType<any>;

    return (
        <div>
            <FormComponent
                {...props.componentProps || {}}
                id={id}
                qeid={props.qeId}
                field={props.field}
                className={classNames({ 'argo-field': true, 'argo-has-value': !!getNestedField(props.formApi.values, props.field) })}/>

            {props.label && <label htmlFor={id} className='argo-label-placeholder'>{props.label}</label>}
            {getNestedField(props.formApi.touched, props.field) &&
                (props.formApi.errors[props.field] && <div className='argo-form-row__error-msg'>{props.formApi.errors[props.field]}</div>)
            }
        </div>
    );
};

export const FormSelect = ReactForm.FormField((props: SelectProps & { fieldApi: ReactForm.FieldApi, className?: string }) => {
    const { fieldApi: {getValue, setValue}, ...rest } = props;
    const value = getValue();

    return (
        <div className={classNames(props.className, 'form-field__select')}>
            <ArgoSelect {...rest} value={value} multiSelect={props.multiSelect}
                onMultiChange={(options) => {
                    setValue(options.map((item) => item.value));
                }}
                onChange={(option) => setValue(option.value)}
            />
        </div>
    );
}) as React.ComponentType<ReactForm.FieldProps & { options: (SelectOption | string)[], multiSelect?: boolean, className?: string }>;
