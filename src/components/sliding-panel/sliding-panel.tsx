import {default as classNames} from 'classnames';
import * as React from 'react';
import { Key, KeybindingContext, KeybindingProvider } from '../../../v2';

export interface SlidingPanelProps extends React.Props<any> {
    isShown?: boolean;
    isNarrow?: boolean;
    isMiddle?: boolean;
    hasNoPadding?: boolean;
    offCanvas?: boolean;
    hasCloseButton?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    onClose?: () => any;
}

require('./sliding-panel.scss');

export const SlidingPanel = (props: SlidingPanelProps) => {
    return (
        <KeybindingProvider>
            <RenderSlidingPanel {...props} />
        </KeybindingProvider>
    );
};

const RenderSlidingPanel = (props: SlidingPanelProps) => {

    const {useKeybinding} = React.useContext(KeybindingContext);

    const closeButtonRef = React.useRef(null);
    const bodyDivRef = React.useRef(null);
    const panelHeaderDivRef = React.useRef(null);
    const panelFooterDivRef = React.useRef(null);

    React.useEffect(() => {
        if (closeButtonRef && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, []);

    useKeybinding({
        keys: Key.ESCAPE,
        action: () => {
            if (props.isShown && props.onClose) {
                props.onClose();
                return true;
            }
            return false;
        },
        combo: false,
        target: [closeButtonRef, bodyDivRef, panelHeaderDivRef, panelFooterDivRef],
    });

    return (
        <div className={classNames('sliding-panel', {
            'sliding-panel--has-header': !!props.header,
            'sliding-panel--has-footer': !!props.footer,
            'sliding-panel--is-narrow': props.isNarrow,
            'sliding-panel--is-middle': props.isMiddle,
            'sliding-panel--opened': props.isShown,
            'sliding-panel--no-padding': props.hasNoPadding,
            'sliding-panel--off-canvas': props.offCanvas,
        })}>
            <div className='sliding-panel__wrapper'>
                {props.isShown && (
                    <button autoFocus={true} className='sliding-panel__close' aria-hidden='true' onClick={() => props.onClose && props.onClose()} ref={closeButtonRef}>
                        <span>
                            <i className='argo-icon-close' aria-hidden='true'/>
                        </span>
                    </button>
                )}
                {props.header && (
                    <div className={classNames('sliding-panel__header', {'sliding-panel__header--close-btn-right-padding': props.hasCloseButton})}
                        ref={panelHeaderDivRef} tabIndex={-1}>
                        {props.header}
                    </div>
                )}
                <div className='sliding-panel__body' ref={bodyDivRef} tabIndex={-1}>
                    {props.children}
                </div>
                {props.footer && (
                    <div className='sliding-panel__footer' ref={panelFooterDivRef} tabIndex={-1}>
                        {props.footer}
                    </div>
                )}
            </div>
            <div className='sliding-panel__outside' onClick={() => props.onClose && props.onClose()}/>
        </div>
    );
};
