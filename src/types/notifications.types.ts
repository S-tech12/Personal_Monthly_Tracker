export type NotificationType = 'alert' | 'info' | 'success' | 'update';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string | React.ReactNode;
  timestamp: string;
  isRead: boolean;
}
