import { generateUUID } from './uuid';
import { asyncStorage } from './localStoragePolyfill';

const NOTIFICATIONS_KEY = '__NOTIFICATIONS__';

// List notifications for a specific user
export async function listNotifications(userId) {
  try {
    const notificationsJson = await asyncStorage.getItem(NOTIFICATIONS_KEY);
    const allNotifications = notificationsJson ? JSON.parse(notificationsJson) : [];
    
    // Filter by userId if provided
    if (userId) {
      return allNotifications.filter(notification => notification.userId === userId);
    }
    
    return allNotifications;
  } catch (error) {
    console.error('Failed to list notifications:', error);
    return [];
  }
}

// Add a new notification
export async function addNotification(notification) {
  try {
    const newNotification = {
      id: generateUUID(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification
    };

    const notificationsJson = await asyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = notificationsJson ? JSON.parse(notificationsJson) : [];
    notifications.push(newNotification);
    
    await asyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return newNotification;
  } catch (error) {
    console.error('Failed to add notification:', error);
    throw error;
  }
}

// Mark a notification as read
export async function markNotificationRead(id) {
  try {
    const notificationsJson = await asyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = notificationsJson ? JSON.parse(notificationsJson) : [];
    
    const index = notifications.findIndex(notification => notification.id === id);
    if (index !== -1) {
      notifications[index].read = true;
      await asyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      return notifications[index];
    }
    
    return null;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return null;
  }
}

// Mark all notifications as read for a specific user
export async function markAllNotificationsRead(userId) {
  try {
    const notificationsJson = await asyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = notificationsJson ? JSON.parse(notificationsJson) : [];
    
    let updatedCount = 0;
    notifications.forEach(notification => {
      if (notification.userId === userId && !notification.read) {
        notification.read = true;
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await asyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
    
    return updatedCount;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return 0;
  }
}

// Bulk update notifications from incoming array
export async function bulkUpdateFromIncoming(incomingNotifications) {
  try {
    const notificationsJson = await asyncStorage.getItem(NOTIFICATIONS_KEY);
    const existingNotifications = notificationsJson ? JSON.parse(notificationsJson) : [];
    
    // Add new notifications that don't already exist
    const updatedNotifications = [...existingNotifications];
    
    incomingNotifications.forEach(incoming => {
      // Check if notification already exists (by id or message content)
      const exists = existingNotifications.find(existing => 
        existing.id === incoming.id || 
        (existing.message === incoming.message && existing.userId === incoming.userId)
      );
      
      if (!exists) {
        const newNotification = {
          id: incoming.id || generateUUID(),
          read: false,
          createdAt: new Date().toISOString(),
          ...incoming
        };
        updatedNotifications.push(newNotification);
      }
    });
    
    await asyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    return updatedNotifications;
  } catch (error) {
    console.error('Failed to bulk update notifications:', error);
    throw error;
  }
}

// Get notification by ID
export async function getNotification(id) {
  try {
    const notificationsJson = await asyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = notificationsJson ? JSON.parse(notificationsJson) : [];
    return notifications.find(notification => notification.id === id) || null;
  } catch (error) {
    console.error('Failed to get notification:', error);
    return null;
  }
}