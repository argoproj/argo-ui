import {default as classNames} from 'classnames';
import * as React from 'react';

export interface BasePopupProps {
    icon?: { name: string; color: string; };
    titleColor?: string;
    title: string | React.ReactNode;
    footer?: React.ReactNode;
    onClose?: () => void;
}

export type PopupPropsWithContent = BasePopupProps & { content: React.ComponentType };
export type PopupPropsWithChildren = BasePopupProps & { children: React.ReactNode};
export type PopupProps = PopupPropsWithContent | PopupPropsWithChildren;

function isPopupWithChildren(value: PopupProps): value is PopupPropsWithChildren {
    return (value as any).children !== undefined;
}

require('./popup.scss');

export const Popup = (props: PopupProps) => {
    const {onClose} = props;
    const canClose = !!onClose;
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const titleId = React.useId();

    React.useLayoutEffect(() => {
        if (!canClose) {
            return;
        }
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const restoreFocus = previouslyFocused?.closest('.sliding-panel--opened')?.querySelector<HTMLElement>('.sliding-panel__body') ?? previouslyFocused;
        dialogRef.current?.focus();
        return () => restoreFocus?.isConnected && restoreFocus.focus();
    }, [canClose]);

    React.useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || event.isComposing || !onClose) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (event.repeat) {
                return;
            }
            if (!dialogRef.current?.contains(document.activeElement)) {
                dialogRef.current?.focus();
                return;
            }
            onClose();
        };
        document.addEventListener('keydown', handleEscape, true);
        return () => document.removeEventListener('keydown', handleEscape, true);
    }, [onClose]);

    return (
        <div className='popup-overlay'>
            <div
                ref={dialogRef}
                className='popup-container'
                role='dialog'
                aria-labelledby={titleId}
                tabIndex={-1}>
                <div id={titleId} className={`row popup-container__header ${props.titleColor !== undefined ? 'popup-container__header__' + props.titleColor : 'popup-container__header__normal'}`}>
                    {props.title}
                </div>
                <div className='row popup-container__body'>
                    {props.icon &&
                        <div className='columns popup-container__icon'>
                            <i className={`${props.icon.name} ${props.icon.color}`}/>
                        </div>
                    }
                    <div className={classNames('columns', {'large-10': !!props.icon, 'large-12': !props.icon}, !props.icon && 'popup-container__body__hasNoIcon')}>
                        {isPopupWithChildren(props) ? props.children : <props.content/>}
                    </div>
                </div>

                <div className={classNames('row popup-container__footer', {'popup-container__footer--additional-padding': !!props.icon})}>
                    {props.footer}
                </div>
            </div>
        </div>
    );
};
