import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { notificationsService } from '../services/notificationsService';
import type { Notification } from '../types/notifications.types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [markAllReadSuccess, setMarkAllReadSuccess] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    setIsMarkingAllRead(true);
    try {
      await notificationsService.markAllAsRead();
      
      // Optimistically update UI
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      // Show success state on button briefly
      setMarkAllReadSuccess(true);
      setTimeout(() => {
        setMarkAllReadSuccess(false);
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to mark all as read');
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.isRead) return;

    // Optimistically update
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );

    try {
      await notificationsService.markAsRead(id);
    } catch (error) {
      // Revert on failure
      setNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, isRead: false } : notif)
      );
      toast.error('Failed to mark as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    isMarkingAllRead,
    markAllReadSuccess,
    handleMarkAllAsRead,
    handleMarkAsRead
  };
};
