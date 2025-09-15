export interface UserNotification {
  id: number;
  type: string;
  user: string;
  created_at: Date;

  lastReadBy?: { id: number; username?: string; email?: string } | null;
  last_read_at?: string | null;
}
