import * as React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Observable, Subscription } from 'rxjs';

require('react-toastify/dist/ReactToastify.css');

const AUTO_CLOSE_TIMEOUT = 10000;

export enum NotificationType {
    Success,
    Warning,
    Error,
}

export interface NotificationInfo {
    type: NotificationType;
    content: React.ReactNode;
}

export interface NotificationsProps {
    notifications: Observable<NotificationInfo>;
}

export class Notifications extends React.Component<NotificationsProps> {
    private subscription: Subscription | null = null;

    constructor(props: NotificationsProps) {
        super(props);
        this.subscription = props.notifications.subscribe((next) => {
            let toastMethod = toast.success;
            switch (next.type) {
                case NotificationType.Error:
                    toastMethod = toast.error;
                    break;
                case NotificationType.Warning:
                    toastMethod = toast.warn;
                    break;
            }
            toastMethod((
                <div onClick={(e) => {
                    const sel = window.getSelection();

                    if (sel) {
                        const range = document.createRange();

                        range.selectNode(e.target as Node);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }}>
                    {next.content}
                </div>
            ), {
                position: toast.POSITION.BOTTOM_RIGHT,
                closeOnClick: false,
                pauseOnHover: true,
                pauseOnFocusLoss: true,
                draggable: false,
                autoClose: AUTO_CLOSE_TIMEOUT,
            });
        });
    }

    public componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    public render() {
        return  <ToastContainer />;
    }
}
