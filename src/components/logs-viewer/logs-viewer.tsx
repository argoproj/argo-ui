import * as React from 'react';
import { Observable, Subscription } from 'rxjs';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

require('./logs-viewer.scss');

export interface LogsSource {
    key: string;
    loadLogs(): Observable<string>;
    shouldRepeat(): boolean;
}

export interface LogsViewerProps {
    source: LogsSource;
}

export interface LogsViewerElement extends HTMLDivElement {
    /**
     * Return the rendered text, including retained scrollback, one line per row
     * with trailing whitespace removed. Pending asynchronous writes are not
     * included until the viewer has processed them.
     * This is mainly for test automation (e.g. Playwright) to
     * quickly get the log text without having to parse the DOM.
     */
    getText(): string;
}

export class LogsViewer extends React.Component<LogsViewerProps> {
    private terminal: Terminal;
    private fitAddon: FitAddon;
    private subscription: Subscription | null = null;

    constructor(props: LogsViewerProps) {
        super(props);
    }

    public initTerminal(container: HTMLElement) {
        this.fitAddon = new FitAddon();
        this.terminal = new Terminal({
            scrollback: 99999,
            allowTransparency: true,
            theme: {
                background: 'transparent',
                foreground: '#495763',
            },
        });
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.open(container);
        this.fitAddon.fit();
        // handle Ctrl+C for copying logs
        this.terminal.attachCustomKeyEventHandler((ev) => {
            if (ev.ctrlKey && ev.code === "KeyC" && ev.type === "keydown") {
                const selection = this.terminal.getSelection();
                if (!selection) return true;
                
                navigator.clipboard?.writeText(selection);
                return false
            }
        });
    }

    public componentDidMount() {
        this.refresh(this.props.source);
    }

    public componentDidUpdate(prevProps: LogsViewerProps) {
        if (prevProps.source.key !== this.props.source.key) {
            this.refresh(this.props.source);
        }
    }

    public componentWillUnmount() {
        this.ensureUnsubscribed();
    }

    public render() {
        return (
            <div className='logs-viewer' ref={(element: LogsViewerElement | null) => {
                if (element) {
                    element.getText = () => this.getText();
                }
            }}>
                <div className='logs-viewer__container' ref={(container) => container && this.initTerminal(container)}/>
            </div>
        );
    }

    public shouldComponentUpdate() {
        return false;
    }

    private getText(): string {
        const buffer = this.terminal.buffer.active;
        const lines: string[] = [];
        for (let y = 0; y < buffer.length; y++) {
            lines.push(buffer.getLine(y)?.translateToString(true) ?? '');
        }
        return lines.join('\n').trimEnd();
    }

    private refresh(source: LogsSource) {
        if (this.terminal) {
            this.terminal.reset();
        }
        this.ensureUnsubscribed();
        const onLoadComplete = () => {
            if (source.shouldRepeat()) {
                this.refresh(source);
            }
        };
        this.subscription = source.loadLogs().subscribe((log) => {
            this.terminal.write(log.replace('\n', '\r\n'));
        }, onLoadComplete, onLoadComplete);
    }

    private ensureUnsubscribed() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}
