import * as React from 'react';
import { Form, FormApi, FormValues, RenderReturn, ValidateValuesFunction } from 'react-form';
import { BehaviorSubject, Observable } from 'rxjs';

import { PopupProps  } from './popup';

export interface PopupApi {
    confirm(title: string, message: string | React.ComponentType): Promise<boolean>;
    prompt(title: string, form: (formApi: FormApi) => RenderReturn, settings?: {
        validate?: ValidateValuesFunction,
        submit?: (vals: FormValues, formApi: FormApi , close: () => any) => any,
    }): Promise<FormValues>;
}

export class PopupManager implements PopupApi {
    private popupPropsSubject: BehaviorSubject<PopupProps> = new BehaviorSubject(null);

    public get popupProps(): Observable<PopupProps> {
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
                        <button className='argo-button argo-button--base' onClick={() => closeAndResolve(true)}>OK</button> <button
                            className='argo-button argo-button--base-o' onClick={() => closeAndResolve(false)}>Cancel</button>
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
    ): Promise<FormValues> {
        return new Promise((resolve) => {
            const closeAndResolve = (result: FormValues) => {
                this.popupPropsSubject.next(null);
                resolve(result);
            };

            let formApi: FormApi;
            let onSubmit: (vals: FormValues) => any = null;
            if (settings && settings.submit) {
                onSubmit = (vals) => (settings.submit(vals, formApi, () => closeAndResolve(vals)));
            } else {
                onSubmit = (vals) => closeAndResolve(vals);
            }

            this.popupPropsSubject.next({
                title: (
                    <span>{title} <i className='argo-icon-close' onClick={() => closeAndResolve(null)}/></span>
                ),
                content: () => (
                    <Form
                        validateError={settings && settings.validate}
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
                        <button className='argo-button argo-button--base' onClick={() => formApi.submitForm(null)}>OK</button> <button
                            className='argo-button argo-button--base-o' onClick={() => closeAndResolve(null)}>Cancel</button>
                    </div>
                ),
            });
        });
    }
}
