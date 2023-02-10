export class NotificationResponse {
  user_id: string;
  title: string;
  content: string;
  notification_type: number;
  object_id: string;
  is_read: number;
  deleted: number;
  avatar: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  position: number;

  constructor(notification: NotificationResponse) {
    this.user_id = notification?.user_id ?? '';
    this.title = notification?.title ?? '';
    this.content = notification?.content ?? '';
    this.notification_type = notification?.notification_type ?? 0;
    this.object_id = notification?.object_id ?? '';
    this.is_read = notification?.is_read ?? 0;
    this.deleted = notification?.deleted ?? 0;
    this.avatar = notification?.avatar ?? '';
    this.name = notification?.name ?? '';
    this.createdAt = notification?.createdAt ?? null;
    this.updatedAt = notification?.updatedAt ?? null;
    this.position = notification?.position ?? 0;
  }

  static mapList(notifications: NotificationResponse[]) {
    return notifications.map((notification) => new NotificationResponse(notification));
  }
}
