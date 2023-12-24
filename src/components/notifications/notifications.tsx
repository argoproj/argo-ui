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
            let toastOptions: any = {
                position: toast.POSITION.BOTTOM_RIGHT,
                closeOnClick: false,
                pauseOnHover: true,
                pauseOnFocusLoss: true,
                draggable: false,
                autoClose: AUTO_CLOSE_TIMEOUT,
                style: {} // Initialize style object
            };

            switch (next.type) {
                case NotificationType.Error:
                    toastMethod = toast.error;
                    toastOptions.style = {
                        color: '#fff', // Change text color to white
                        backgroundColor: '#d32f2f', // Change background color to a high-contrast red
                        /* Add any other styles to enhance contrast */
                    };
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
            ), toastOptions);
        });
    }

    public componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    public render() {
        const toastStyles = 
            .Toastify__toast--error {
                color: #fff; /* Change text color to white */
                background-color: #d32f2f; /* Change background color to a high-contrast red */
                /* Add any other styles to enhance contrast */
            }
        ;

        return (
            <>
                <ToastContainer />
                <style>{toastStyles}</style>
            </>
        );
    }
}
