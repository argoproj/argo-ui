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

export class LogsViewer extends React.Component<LogsViewerProps> {
    private terminal: Terminal;
    private fitAddon: FitAddon;
    private subscription: Subscription | null = null;

    constructor(props: LogsViewerProps) {
        super(props);
    }

    public componentWillReceiveProps(nextProps: LogsViewerProps) {
        if (this.props.source.key !== nextProps.source.key) {
            this.refresh(nextProps.source);
        }
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
    }

    public componentDidMount() {
        this.refresh(this.props.source);
    }

    public componentWillUnmount() {
        this.ensureUnsubscribed();
    }

    public render() {
        return (
            <div className='logs-viewer'>
                <div className='logs-viewer__container' ref={(container) => container && this.initTerminal(container)}/>
            </div>
        );
    }

    public shouldComponentUpdate(prevProps: LogsViewerProps) {
        return false;
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
