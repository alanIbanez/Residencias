

import * as Notifications from "expo-notifications";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { registerForPushNotificationsAsync } from "../../../utils/registerForPushNotificationsAsync";
import { getCurrentUser } from "../../../services/salidasStorage";
import { addNotification, listNotifications, markNotificationRead } from "../../../services/notificationsStorage";

const NotificationContext = createContext(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [countNotification, setCountNotification] = useState(0);
  const [iconColor, setIconColor] = useState('black');
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  const setPrimaryColor = () => setIconColor('#007bff');
  const setDefaultColor = () => setIconColor('black');

  const restartCountNotification = () => setCountNotification(0);

  // Load user-specific notifications from storage
  const loadNotifications = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const userNotifications = await listNotifications(user.id);
        setNotifications(userNotifications);
        
        // Update count of unread notifications
        const unreadCount = userNotifications.filter(n => !n.read).length;
        setCountNotification(unreadCount);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      
      setNotifications((prev) => {
        const updated = prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        );
        
        // Update count
        const unreadCount = updated.filter(n => !n.read).length;
        setCountNotification(unreadCount);
        
        return updated;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      if (!currentUser) return;
      
      // Mark all as read in storage
      const promises = notifications
        .filter(n => !n.read)
        .map(n => markNotificationRead(n.id));
      
      await Promise.all(promises);
      
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
      setCountNotification(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications, currentUser]);

  // Handle incoming notifications
  const handleIncomingNotification = useCallback(async (notification) => {
    try {
      const title = notification?.request?.content?.title?.trim();
      if (!title) return;

      const user = await getCurrentUser();
      if (!user) return;

      // Extract additional data from notification payload
      const data = notification?.request?.content?.data || {};
      
      const newNotification = {
        userId: user.id, // Assign to current user
        message: title,
        read: false,
        salidaId: data.salidaId || null,
        estado: data.estado || null,
      };

      // Save to persistent storage
      const savedNotification = await addNotification(newNotification);
      
      // Update local state
      setNotifications((prev) => [...prev, savedNotification]);
      setCountNotification((prevCount) => prevCount + 1);
      
    } catch (error) {
      console.error('Error handling incoming notification:', error);
    }
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) setExpoPushToken(token);
      })
      .catch((err) => setError(err));

    // Load notifications on mount
    loadNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(handleIncomingNotification);

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("🔔 Notification Response:", JSON.stringify(response, null, 2));
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [loadNotifications, handleIncomingNotification]);

  const value = useMemo(() => ({
    notifications,
    countNotification,
    iconColor,
    expoPushToken,
    error,
    currentUser,
    setPrimaryColor,
    setDefaultColor,
    restartCountNotification,
    markAsRead,
    markAllAsRead,
    loadNotifications,
  }), [
    notifications,
    countNotification,
    iconColor,
    expoPushToken,
    error,
    currentUser,
    markAsRead,
    markAllAsRead,
    loadNotifications,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
