import * as React from 'react';
import { Form, FormApi, FormValues, RenderReturn, ValidateValuesFunction } from 'react-form';
import { BehaviorSubject } from 'rxjs';

import { PopupProps  } from './popup';

export interface PopupApi {
    confirm(title: string, message: string | React.ComponentType): Promise<boolean>;
    prompt(
        title: string,
        form: (formApi: FormApi) => RenderReturn, settings?: {
            validate?: ValidateValuesFunction,
            submit?: (vals: FormValues, formApi: FormApi, close: () => any) => any,
        },
        customIcon?: {name: string, color: string},
        titleColor?: string,
        defaultValues?: {},
    ): Promise<FormValues | null>;
}

export class PopupManager implements PopupApi {
    private popupPropsSubject = new BehaviorSubject<PopupProps | null>(null);

    public get popupProps() {
        return this.popupPropsSubject.asObservable();
    }

    public confirm(title: string, message: string | React.ComponentType): Promise<boolean> {
        const content = typeof message === 'string' && (() => (<p>{message}</p>)) || message as React.ComponentType;

        return new Promise((resolve) => {
            const closeAndResolve = (result: boolean) => {
                this.popupPropsSubject.next(null);
                resolve(result);
            };

            this.popupPropsSubject.next({
                title: (
                    <span>{title} <i className='argo-icon-close' onClick={() => closeAndResolve(false)}/></span>
                ),
                content,
                footer: (
                    <div>
                        <button qe-id='argo-popup-ok-button' className='argo-button argo-button--base' onClick={() => closeAndResolve(true)}>OK</button> <button
                            qe-id='argo-popup-cancel-button' className='argo-button argo-button--base-o' onClick={() => closeAndResolve(false)}>Cancel</button>
                    </div>
                ),
            });
        });
    }

    public prompt(
        title: string,
        form: (formApi: FormApi) => RenderReturn,
        settings?: {
            validate?: ValidateValuesFunction,
            submit?: (vals: FormValues, formApi: FormApi , close: () => any) => any,
        },
        customIcon?: { name: string, color: string },
        titleColor?: string,
        defaultValues?: {},
    ): Promise<FormValues | null> {
        return new Promise((resolve) => {
            const closeAndResolve = (result: FormValues | null) => {
                this.popupPropsSubject.next(null);
                resolve(result);
            };

            let formApi: FormApi;
            let onSubmit: (vals: FormValues) => any;

            if (settings && settings.submit) {
                const submit = settings.submit.bind(settings);
                onSubmit = (vals) => (submit(vals, formApi, () => closeAndResolve(vals)));
            } else {
                onSubmit = (vals) => closeAndResolve(vals);
            }

            this.popupPropsSubject.next({
                children: undefined,
                title: (
                    <span>{title} <i className='argo-icon-close' onClick={() => closeAndResolve(null)}/></span>
                ),
                titleColor: titleColor ? titleColor : 'normal',
                icon: customIcon ? { name: customIcon?.name, color: customIcon?.color} : undefined,
                content: () => (
                    <Form
                        validateError={settings && settings.validate}
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                        getApi={(api) => formApi = api}>
                        {(api) => (
                            <form onSubmit={api.submitForm}>
                                {form(api)}
                            </form>
                        )}
                    </Form>
                ),
                footer: (
                    <div>
                        <button qe-id='prompt-popup-ok-button' className='argo-button argo-button--base' onClick={(e) => formApi.submitForm(e)}>OK</button> <button
                            qe-id='prompt-popup-cancel-button' className='argo-button argo-button--base-o' onClick={() => closeAndResolve(null)}>Cancel</button>
                    </div>
                ),
            });
        });
    }
}
