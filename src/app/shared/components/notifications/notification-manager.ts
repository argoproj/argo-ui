import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationInfo } from './notifications';

export interface NotificationsApi {
    show(notification: NotificationInfo, autoHideMs?: number): void;
}

export class NotificationsManager {
    private notificationsSubject: BehaviorSubject<NotificationInfo> = new BehaviorSubject(null);

    public get notifications(): Observable<NotificationInfo> {
        return this.notificationsSubject.asObservable().filter((next) => !!next);
    }

    public show(notification: NotificationInfo) {
        this.notificationsSubject.next(notification);
    }
}
