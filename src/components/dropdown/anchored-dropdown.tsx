/* eslint-disable react/prop-types */
import {default as classNames} from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface AnchoredDropdownProps {
    isMenu?: boolean;
    anchor: React.RefObject<HTMLElement>;
    children: React.ReactNode | (() => React.ReactNode);
    qeId?: string;
    onOpenStateChange?: (open: boolean) => void;
}

export interface AnchoredDropdownHandle {
    open: () => void;
    close: () => void;
}

require('./dropdown.scss');

export const AnchoredDropdown = React.forwardRef<AnchoredDropdownHandle, AnchoredDropdownProps>((props, ref) => {
    const [opened, setOpened] = React.useState(false);
    const [position, setPosition] = React.useState({ left: 0, top: 0 });
    const contentRef = React.useRef<HTMLDivElement>(null);

    const calculatePosition = React.useCallback(() => {
        const anchor = props.anchor.current;
        const content = contentRef.current;
        if (!anchor || !content) {
            return position;
        }

        const { top, left } = anchor.getBoundingClientRect();
        const anchorHeight = anchor.offsetHeight + 2;

        let newTop: number;
        let newLeft: number;

        // Set top position - flip above anchor if not enough space below
        if (content.offsetHeight + top + anchorHeight > window.innerHeight) {
            newTop = top - content.offsetHeight - 2;
        } else {
            newTop = top + anchorHeight;
        }

        // Set left position - align right edge if not enough space on right
        if (content.offsetWidth + left > window.innerWidth) {
            newLeft = left - content.offsetWidth + anchor.offsetWidth;
        } else {
            newLeft = left;
        }

        return { left: newLeft, top: newTop };
    }, [props.anchor, position]);

    const close = React.useCallback(() => {
        setOpened(false);
        props.onOpenStateChange?.(false);
    }, [props.onOpenStateChange]);

    const open = React.useCallback(() => {
        if (!contentRef.current || !props.anchor.current) {
            return;
        }

        setPosition(calculatePosition());
        setOpened(true);
        props.onOpenStateChange?.(true);
    }, [props.anchor, props.onOpenStateChange, calculatePosition]);

    // Expose open/close methods via ref
    React.useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    // Click outside handler
    React.useEffect(() => {
        if (!opened) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as Node;
            const content = contentRef.current;
            const anchor = props.anchor.current;

            // Ignore if target is detached from DOM
            if (!target.parentElement) return;

            // Close if click is outside both content and anchor
            if (content && !content.contains(target) && (!anchor || !anchor.contains(target))) {
                close();
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [opened, props.anchor, close]);

    // Scroll repositioning handler
    React.useEffect(() => {
        if (!opened) return;

        const handleScroll = () => {
            if (contentRef.current && props.anchor.current) {
                setPosition(calculatePosition());
            }
        };

        document.addEventListener('scroll', handleScroll, { passive: true });
        return () => document.removeEventListener('scroll', handleScroll);
    }, [opened, props.anchor, calculatePosition]);

    // Render children - lazy evaluation if function
    let children: React.ReactNode = null;
    if (typeof props.children === 'function') {
        if (opened) {
            children = (props.children as () => React.ReactNode)();
        }
    } else {
        children = props.children;
    }

    return ReactDOM.createPortal(
        <div
            className={classNames('argo-dropdown__content', { opened, 'is-menu': props.isMenu })}
            style={{ top: position.top, left: position.left }}
            ref={contentRef}
        >
            {children}
        </div>,
        document.body
    );
});

AnchoredDropdown.displayName = 'AnchoredDropdown';
