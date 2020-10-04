import { ReplaySubject } from 'rxjs';
import { NotificationInfo } from './notifications';

export interface NotificationsApi {
    show(notification: NotificationInfo, autoHideMs?: number): void;
}

export class NotificationsManager {
    private readonly notificationsSubject = new ReplaySubject<NotificationInfo>(1);

    public get notifications() {
        return this.notificationsSubject.asObservable();
    }

    public show(notification: NotificationInfo) {
        this.notificationsSubject.next(notification);
    }
}
