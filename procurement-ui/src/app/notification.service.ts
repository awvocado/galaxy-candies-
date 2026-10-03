import { Injectable, computed, signal } from '@angular/core';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Bottleneck Detected',
      message: 'Packaging Pouches (PKG-PCH-03) stock is at 150 pcs, limiting candy yield.',
      type: 'warning',
      timestamp: '10m ago',
      read: false,
      link: '/warehouse'
    },
    {
      id: 'notif-2',
      title: 'QA Clearance Passed',
      message: 'Refined Sugar (BAT-2609-02) cleared and shifted to Available Raw stock.',
      type: 'success',
      timestamp: '1h ago',
      read: false,
      link: '/qa'
    },
    {
      id: 'notif-3',
      title: 'Sales Allocation',
      message: '50 units of Mango Candy reserved for order ORD-2026-104.',
      type: 'info',
      timestamp: '2h ago',
      read: true,
      link: '/sales'
    }
  ]);

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly unreadCount = computed(
    () => this.notificationsSignal().filter(n => !n.read).length
  );

  notify(item: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): void {
    const newEntry: AppNotification = {
      ...item,
      id: 'notif-' + Math.random().toString(36).substring(2, 7),
      timestamp: 'Just now',
      read: false
    };
    this.notificationsSignal.update(list => [newEntry, ...list]);
  }

  markAsRead(id: string): void {
    this.notificationsSignal.update(list =>
      list.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllAsRead(): void {
    this.notificationsSignal.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }

  remove(id: string): void {
    this.notificationsSignal.update(list => list.filter(n => n.id !== id));
  }

  clearAll(): void {
    this.notificationsSignal.set([]);
  }
}