import * as React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {Tooltip} from './tooltip';

jest.mock('tippy.js', () => {
    const tippy = jest.fn((target: Element, options: any) => {
        const contentNode: Element = typeof options.content === 'string' ? document.createElement('div') : options.content;
        if (typeof options.content === 'string') {
            contentNode.textContent = options.content;
        }

        let isEnabled = true;

        const show = () => {
            if (!isEnabled) {
                return;
            }
            if (!document.body.contains(contentNode)) {
                document.body.appendChild(contentNode);
            }
        };
        const hide = () => {
            if (document.body.contains(contentNode)) {
                document.body.removeChild(contentNode);
            }
        };

        const clickHide = () => {
            if (options.hideOnClick === false) {
                return;
            }
            hide();
        };

        target.addEventListener('mouseenter', show);
        target.addEventListener('mouseleave', hide);
        target.addEventListener('click', clickHide);

        const tooltipBox = document.createElement('div');
        tooltipBox.className = 'tippy-tooltip';

        let currentProps = {...options};

        const instance = {
            setProps: jest.fn((partialProps: any) => {
                currentProps = {...currentProps, ...partialProps};
            }),
            get props() {
                return currentProps;
            },
            destroy: jest.fn(() => {
                hide();
                target.removeEventListener('mouseenter', show);
                target.removeEventListener('mouseleave', hide);
                target.removeEventListener('click', clickHide);
            }),
            show: jest.fn((duration?: number) => {
                void duration;
                show();
            }),
            hide: jest.fn((duration?: number) => {
                void duration;
                if (document.body.contains(contentNode)) {
                    document.body.removeChild(contentNode);
                }
            }),
            enable: jest.fn(() => {
                isEnabled = true;
            }),
            disable: jest.fn(() => {
                isEnabled = false;
                if (document.body.contains(contentNode)) {
                    document.body.removeChild(contentNode);
                }
            }),
            popperChildren: {tooltip: tooltipBox},
            popperInstance: {scheduleUpdate: jest.fn(() => contentNode.textContent)}
        };

        if (typeof options.onCreate === 'function') {
            options.onCreate(instance);
        }

        return instance;
    });

    return {__esModule: true, default: tippy};
});

describe('Tooltip', () => {
    test('renders and unmounts in StrictMode without React 19 element.ref warnings', async () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        const {unmount} = render(
            <React.StrictMode>
                <Tooltip content='hello'>
                    <span>target</span>
                </Tooltip>
            </React.StrictMode>
        );

        await userEvent.hover(screen.getByText('target'));
        unmount();

        const badCall = errorSpy.mock.calls.find(call => call.some(arg => typeof arg === 'string' && (arg.includes('element.ref') || arg.includes('React 19'))));
        expect(badCall).toBeUndefined();

        errorSpy.mockRestore();
    });

    test('omits optional props entirely from the tippy() options object when the caller does not pass them', () => {
        render(
            <Tooltip content='hi'>
                <span>target</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        const options = tippyMock.mock.calls[tippyMock.mock.calls.length - 1][1];

        ['placement', 'zIndex', 'popperOptions', 'arrow', 'allowHTML', 'duration', 'hideOnClick'].forEach(key => {
            expect(Object.keys(options)).not.toContain(key);
        });
    });

    test('shows tooltip content on hover and hides on unhover', async () => {
        render(
            <Tooltip content='tooltip text'>
                <span>hover me</span>
            </Tooltip>
        );

        const target = screen.getByText('hover me');

        await userEvent.hover(target);
        await waitFor(() => expect(screen.getByText('tooltip text')).toBeInTheDocument());

        await userEvent.unhover(target);
        await waitFor(() => expect(screen.queryByText('tooltip text')).not.toBeInTheDocument());
    });

    test('accepts JSX content, not just strings', async () => {
        render(
            <Tooltip
                content={
                    <div className='custom-tooltip'>
                        <strong>bold</strong> content
                    </div>
                }>
                <span>hover me</span>
            </Tooltip>
        );

        await userEvent.hover(screen.getByText('hover me'));
        await waitFor(() => expect(screen.getByText('bold')).toBeInTheDocument());
    });

    test('repositions after updated content is committed without recreating the visible tooltip', async () => {
        const {rerender} = render(
            <Tooltip content='First tooltip message' hideOnClick={false}>
                <button>target</button>
            </Tooltip>
        );

        await userEvent.hover(screen.getByRole('button', {name: 'target'}));
        await screen.findByText('First tooltip message');

        const tippyMock = jest.requireMock('tippy.js').default;
        const instance = tippyMock.mock.results[tippyMock.mock.results.length - 1].value;
        const scheduleUpdate = instance.popperInstance.scheduleUpdate;

        for (const content of ['Message', 'A longer tooltip message after switching back']) {
            scheduleUpdate.mockClear();
            rerender(
                <Tooltip content={content} hideOnClick={false}>
                    <button>target</button>
                </Tooltip>
            );

            await waitFor(() => {
                expect(scheduleUpdate).toHaveBeenCalled();
                // Measure the committed DOM, rather than the previous content's dimensions.
                expect(scheduleUpdate.mock.results[scheduleUpdate.mock.results.length - 1].value).toBe(content);
            });
            expect(screen.getByText(content)).toBeVisible();
            expect(instance.destroy).not.toHaveBeenCalled();
        }
    });

    test('passes placement, zIndex, and popperOptions straight through to tippy()', () => {
        const popperOptions = {
            modifiers: {
                preventOverflow: {enabled: true},
                hide: {enabled: false}
            }
        };

        render(
            <Tooltip content='x' placement='bottom' zIndex={9999} popperOptions={popperOptions}>
                <span>target</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        expect(tippyMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                placement: 'bottom',
                zIndex: 9999,
                popperOptions
            })
        );
    });

    test('passes interactive, theme, appendTo, animation, and arrow straight through to tippy(), with defaults when omitted', () => {
        render(
            <Tooltip content='x'>
                <span>defaults</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        expect(tippyMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                interactive: true,
                theme: 'light',
                appendTo: document.body,
                animation: 'fade'
            })
        );

        const container = document.createElement('div');
        render(
            <Tooltip content='x' interactive={false} theme='dark' appendTo={container} animation='shift-away' arrow={true}>
                <span>overrides</span>
            </Tooltip>
        );

        expect(tippyMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                interactive: false,
                theme: 'dark',
                appendTo: container,
                animation: 'shift-away',
                arrow: true
            })
        );
    });

    test('calls the tippy instance destroy() on unmount', () => {
        const {unmount} = render(
            <Tooltip content='x'>
                <span>target</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        const instance = tippyMock.mock.results[tippyMock.mock.results.length - 1].value;

        unmount();

        expect(instance.destroy).toHaveBeenCalledTimes(1);
    });

    test('a child with its own forwardRef still receives the underlying DOM node', () => {
        const received: {node: HTMLElement | null} = {node: null};

        const Target = React.forwardRef<HTMLSpanElement>(function Target(_props, ref) {
            const localRef = React.useCallback(
                (node: HTMLSpanElement | null) => {
                    received.node = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
                    }
                },
                [ref]
            );
            return <span ref={localRef}>target</span>;
        });

        const outerRef = React.createRef<HTMLSpanElement>();

        render(
            <Tooltip content='x'>
                <Target ref={outerRef} />
            </Tooltip>
        );

        expect(received.node).not.toBeNull();
        expect(received.node).toBe(screen.getByText('target'));

        const tippyMock = jest.requireMock('tippy.js').default;
        expect(tippyMock).toHaveBeenCalledWith(received.node, expect.anything());
    });

    test('enabled={false} suppresses the tooltip from showing on hover', async () => {
        render(
            <Tooltip content='tooltip text' enabled={false}>
                <span>hover me</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        const instance = tippyMock.mock.results[tippyMock.mock.results.length - 1].value;
        expect(instance.disable).toHaveBeenCalled();

        await userEvent.hover(screen.getByText('hover me'));
        expect(screen.queryByText('tooltip text')).not.toBeInTheDocument();
    });

    test('toggling enabled back to true re-enables the tooltip', async () => {
        const {rerender} = render(
            <Tooltip content='tooltip text' enabled={false}>
                <span>hover me</span>
            </Tooltip>
        );

        rerender(
            <Tooltip content='tooltip text' enabled={true}>
                <span>hover me</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        const instance = tippyMock.mock.results[tippyMock.mock.results.length - 1].value;
        expect(instance.enable).toHaveBeenCalled();

        await userEvent.hover(screen.getByText('hover me'));
        await waitFor(() => expect(screen.getByText('tooltip text')).toBeInTheDocument());
    });

    test('hideOnClick={false} keeps the tooltip visible after a click on the trigger', async () => {
        render(
            <Tooltip content='Copied!' hideOnClick={false}>
                <span>click me</span>
            </Tooltip>
        );

        const target = screen.getByText('click me');

        await userEvent.hover(target);
        await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument());

        await userEvent.click(target);
        expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    test('passes allowHTML, duration, and hideOnClick straight through to tippy()', () => {
        render(
            <Tooltip content='x' allowHTML={true} duration={200} hideOnClick={false}>
                <span>target</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        expect(tippyMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                allowHTML: true,
                duration: 200,
                hideOnClick: false
            })
        );
    });

    test('className is applied to the tippy popper box via onCreate', () => {
        render(
            <Tooltip content='x' className='custom-tooltip'>
                <span>target</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        const instance = tippyMock.mock.results[tippyMock.mock.results.length - 1].value;

        expect(instance.popperChildren.tooltip.classList.contains('custom-tooltip')).toBe(true);
    });

    test('visible={true} calls instance.show(duration) and visible={false} calls instance.hide(duration)', () => {
        const {rerender} = render(
            <Tooltip content='x' visible={false} duration={150}>
                <span>target</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        const instance = tippyMock.mock.results[tippyMock.mock.results.length - 1].value;

        expect(instance.hide).toHaveBeenCalledWith(150);

        rerender(
            <Tooltip content='x' visible={true} duration={150}>
                <span>target</span>
            </Tooltip>
        );

        expect(instance.show).toHaveBeenCalledWith(150);
    });

    test('a prop change updates the existing tippy instance instead of destroying and recreating it', () => {
        const tippyMock = jest.requireMock('tippy.js').default;
        tippyMock.mockClear();

        const {rerender} = render(
            <Tooltip content='x' placement='top' popperOptions={{modifiers: {hide: {enabled: false}}}}>
                <span>target</span>
            </Tooltip>
        );

        expect(tippyMock).toHaveBeenCalledTimes(1);
        const instance = tippyMock.mock.results[0].value;

        rerender(
            <Tooltip content='x' placement='bottom' popperOptions={{modifiers: {hide: {enabled: false}}}}>
                <span>target</span>
            </Tooltip>
        );

        expect(tippyMock).toHaveBeenCalledTimes(1);
        expect(instance.destroy).not.toHaveBeenCalled();
        expect(instance.setProps).toHaveBeenCalledWith(expect.objectContaining({placement: 'bottom'}));
    });

    test('setProps omits optional props the caller did not pass, so tippy defaults are preserved', () => {
        const {rerender} = render(
            <Tooltip content='x' theme='light'>
                <span>target</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        const instance = tippyMock.mock.results[tippyMock.mock.results.length - 1].value;

        rerender(
            <Tooltip content='x' theme='dark'>
                <span>target</span>
            </Tooltip>
        );

        const partialProps = instance.setProps.mock.calls[instance.setProps.mock.calls.length - 1][0];
        ['placement', 'zIndex', 'popperOptions', 'arrow', 'allowHTML', 'duration', 'hideOnClick'].forEach(key => {
            expect(Object.keys(partialProps)).not.toContain(key);
        });
    });

    test('enabled={false} survives an unrelated prop change', async () => {
        const {rerender} = render(
            <Tooltip content='tooltip text' enabled={false} placement='top'>
                <span>hover me</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        const instance = tippyMock.mock.results[tippyMock.mock.results.length - 1].value;

        rerender(
            <Tooltip content='tooltip text' enabled={false} placement='bottom'>
                <span>hover me</span>
            </Tooltip>
        );

        expect(instance.enable).not.toHaveBeenCalled();

        await userEvent.hover(screen.getByText('hover me'));
        expect(screen.queryByText('tooltip text')).not.toBeInTheDocument();
    });

    test('a className change removes the old class and adds the new one', () => {
        const {rerender} = render(
            <Tooltip content='x' className='old-class shared-class'>
                <span>target</span>
            </Tooltip>
        );

        const tippyMock = jest.requireMock('tippy.js').default;
        const instance = tippyMock.mock.results[tippyMock.mock.results.length - 1].value;
        const box = instance.popperChildren.tooltip;

        expect(box.classList.contains('old-class')).toBe(true);

        rerender(
            <Tooltip content='x' className='new-class shared-class'>
                <span>target</span>
            </Tooltip>
        );

        expect(box.classList.contains('old-class')).toBe(false);
        expect(box.classList.contains('new-class')).toBe(true);
        expect(box.classList.contains('shared-class')).toBe(true);
        expect(box.classList.contains('tippy-tooltip')).toBe(true);
    });
});
