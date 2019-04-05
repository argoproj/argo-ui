import * as classNames from 'classnames';
import * as React from 'react';

export enum NotificationType {
    Success,
    Warning,
    Error,
}

export interface NotificationInfo {
    type: NotificationType;
    style?: React.CSSProperties;
    content: React.ReactNode;
}

export interface NotificationsProps {
    notifications: NotificationInfo[];
    closeNotification: (notification: NotificationInfo) => any;
    leftOffset: number;
}

require('./notifications.scss');

export const Notifications = (props: NotificationsProps) => (
    <div className='argo-notifications-list' style={{left: props.leftOffset}}>
        {props.notifications.map((notification, i) => (
            <div key={i} style={notification.style} className={classNames('argo-notification', {
                success: notification.type === NotificationType.Success,
                warning: notification.type === NotificationType.Warning,
                error: notification.type === NotificationType.Error,
            })}>
                {notification.type === NotificationType.Success && <i className='fa fa-check-circle'/>}
                {notification.type === NotificationType.Warning && <i className='fa fa-exclamation-triangle'/>}
                {notification.type === NotificationType.Error && <i className='fa fa-times-circle'/>}
                <div className='argo-notification__content'>
                    {notification.content}
                </div>
                {props.closeNotification && <div className='argo-notification__close' onClick={() => props.closeNotification(notification)}>x</div>}
            </div>
        ))}
    </div>
);
