import * as classNames from 'classnames';
import * as React from 'react';

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

export const SlidingPanel = (props: SlidingPanelProps) => (
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
            <button className='sliding-panel__close' aria-hidden='true' onClick={() => props.onClose && props.onClose()}>
                <span>
                    <i className='argo-icon-close' aria-hidden='true'/>
                </span>
            </button>
            {props.header && (
                <div className={classNames('sliding-panel__header', {'sliding-panel__header--close-btn-right-padding': props.hasCloseButton})}>
                    {props.header}
                </div>
            )}
            <div className='sliding-panel__body'>
                {props.children}
            </div>
            {props.footer && (
                <div className='sliding-panel__footer'>
                    {props.footer}
                </div>
            )}
        </div>
        <div className='sliding-panel__outside' onClick={() => props.onClose && props.onClose()}/>
    </div>
);
