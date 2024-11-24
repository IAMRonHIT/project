import { useEffect } from 'react';
import { notificationService } from '@/services/notifications';

export function useNotifications() {
  useEffect(() => {
    const unsubscribe = notificationService.subscribe(notification => {
      // Handle notifications here
      console.log('Notification received:', notification);
    });

    return () => unsubscribe();
  }, []);
}