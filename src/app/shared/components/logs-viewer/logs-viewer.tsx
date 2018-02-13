import * as React from 'react';
import { Observable, Subscription } from 'rxjs';

const Terminal = require('xterm');
Terminal.loadAddon('fit');

require('./logs-viewer.scss');

export interface LogsSource {
    key: string;
    loadLogs(): Observable<string>;
    shouldRepeat(): boolean;
}

interface Props {
    source: LogsSource;
}

export class LogsViewer extends React.Component<Props> {
    private terminal: any;
    private subscription: Subscription;

    constructor(props: Props) {
        super(props);
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.source.key !== nextProps.source.key) {
            this.refresh();
        }
    }

    public initTerminal(container: HTMLElement) {
        this.terminal = new Terminal({
            scrollback: 99999,
            theme: 'ax',
        });

        this.terminal.open(container);
        this.terminal.fit();
    }

    public componentDidMount() {
        this.refresh();
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

    public shouldComponentUpdate(prevProps: Props) {
        return false;
    }

    private refresh() {
        this.terminal.reset();
        this.ensureUnsubscribed();
        const onLoadComplete = () => {
            if (this.props.source.shouldRepeat()) {
                this.refresh();
            }
        };
        this.subscription = this.props.source.loadLogs().subscribe((log) => {
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
