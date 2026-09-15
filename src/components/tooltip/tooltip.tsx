import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import tippy, {Instance, Placement} from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

const assignRef = <T,>(ref: React.Ref<T> | null | undefined, node: T | null) => {
    if (typeof ref === 'function') {
        ref(node);
    } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
    }
};

export interface TooltipProps {
    content: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    popperOptions?: any;
    zIndex?: number;
    placement?: Placement;
    interactive?: boolean;
    theme?: string;
    appendTo?: Element | ((ref: Element) => Element);
    animation?: string;
    arrow?: boolean;
    enabled?: boolean;
    visible?: boolean;
    duration?: number;
    allowHTML?: boolean;
    className?: string;
    hideOnClick?: boolean;
    children: React.ReactElement;
    maxWidth?: number | string;
}

export const Tooltip = ({
    content,
    popperOptions,
    zIndex,
    placement,
    interactive = true,
    theme = 'light',
    appendTo = document.body,
    animation = 'fade',
    arrow,
    enabled = true,
    visible,
    duration,
    allowHTML,
    className,
    hideOnClick,
    children,
    maxWidth,
}: TooltipProps) => {
    const child = React.Children.only(children) as React.ReactElement<{ref?: React.Ref<Element>}>;
    const [target, setTarget] = React.useState<Element | null>(null);
    const instanceRef = React.useRef<Instance | null>(null);
    const reactRootRef = React.useRef<ReactDOM.Root | null>(null);
    const appliedClassNamesRef = React.useRef<string[]>([]);

    const setRef = React.useCallback(
        (node: Element | null) => {
            assignRef(child.props.ref, node);
            setTarget(node);
        },
        [child]
    );

    React.useEffect(() => {
        if (!target) {
            return;
        }

        const container = document.createElement('div');
        const reactRoot = ReactDOM.createRoot(container);
        reactRootRef.current = reactRoot;
        reactRoot.render(content);

        const instance = tippy(target, {
            content: container,
            theme,
            appendTo,
            animation,
            interactive,
            ...(maxWidth !== undefined ? {maxWidth} : {}),
            ...(placement !== undefined ? {placement} : {}),
            ...(zIndex !== undefined ? {zIndex} : {}),
            ...(popperOptions !== undefined ? {popperOptions} : {}),
            ...(arrow !== undefined ? {arrow} : {}),
            ...(allowHTML !== undefined ? {allowHTML} : {}),
            ...(duration !== undefined ? {duration} : {}),
            ...(hideOnClick !== undefined ? {hideOnClick} : {}),
            onCreate(createdInstance: Instance) {
                const classes = className ? className.split(' ').filter(Boolean) : [];
                appliedClassNamesRef.current = classes;
                if (classes.length > 0) {
                    createdInstance.popperChildren.tooltip.classList.add(...classes);
                }
            }
        });
        instanceRef.current = instance;

        return () => {
            instance.destroy();
            instanceRef.current = null;
            reactRootRef.current = null;
            appliedClassNamesRef.current = [];
            queueMicrotask(() => reactRoot.unmount());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target]);

    React.useEffect(() => {
        const instance = instanceRef.current;
        if (!instance) {
            return;
        }

        instance.setProps({
            theme,
            appendTo,
            animation,
            interactive,
            ...(placement !== undefined ? {placement} : {}),
            ...(zIndex !== undefined ? {zIndex} : {}),
            ...(popperOptions !== undefined ? {popperOptions} : {}),
            ...(arrow !== undefined ? {arrow} : {}),
            ...(allowHTML !== undefined ? {allowHTML} : {}),
            ...(duration !== undefined ? {duration} : {}),
            ...(hideOnClick !== undefined ? {hideOnClick} : {})
        });
    }, [target, placement, interactive, zIndex, popperOptions, theme, appendTo, animation, arrow, allowHTML, duration, hideOnClick, maxWidth]);

    React.useEffect(() => {
        const instance = instanceRef.current;
        if (!instance) {
            return;
        }

        const next = className ? className.split(' ').filter(Boolean) : [];
        const previous = appliedClassNamesRef.current;
        const removed = previous.filter(cls => !next.includes(cls));
        const added = next.filter(cls => !previous.includes(cls));
        appliedClassNamesRef.current = next;

        if (removed.length > 0) {
            instance.popperChildren.tooltip.classList.remove(...removed);
        }
        if (added.length > 0) {
            instance.popperChildren.tooltip.classList.add(...added);
        }
    }, [target, className]);

    React.useEffect(() => {
        if (reactRootRef.current) {
            reactRootRef.current.render(content);
        }
    }, [content]);

    React.useEffect(() => {
        if (!instanceRef.current) {
            return;
        }
        if (enabled) {
            instanceRef.current.enable();
        } else {
            instanceRef.current.disable();
        }
    }, [target, enabled]);

    React.useEffect(() => {
        if (!instanceRef.current || visible === undefined) {
            return;
        }
        if (visible) {
            instanceRef.current.show(duration);
        } else {
            instanceRef.current.hide(duration);
        }
    }, [target, visible, duration]);

    return React.cloneElement(child, {ref: setRef});
};
