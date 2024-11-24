import { useState, useEffect } from 'react';

type NotificationType = 'case-update' | 'urgent' | 'deadline' | 'ai-insight';

interface Notification {
  type: NotificationType;
  message: string;
  data?: any;
}

type NotificationCallback = (notification: Notification) => void;

class NotificationService {
  private subscribers: NotificationCallback[] = [];

  subscribe(callback: NotificationCallback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  send(notification: Notification) {
    this.subscribers.forEach(callback => callback(notification));
  }
}

export const notificationService = new NotificationService();