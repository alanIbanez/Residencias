

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

  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  const setPrimaryColor = () => setIconColor('#007bff');
  const setDefaultColor = () => setIconColor('black');

  const restartCountNotification = () => setCountNotification(0);

  const markAsRead = useCallback((index) => {
    setNotifications((prev) => {
      const updated = [...prev];
      if (updated[index] && !updated[index].read) {
        updated[index] = { ...updated[index], read: true };
        setCountNotification((prevCount) => Math.max(prevCount - 1, 0));
      }
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const unreadCount = prev.filter((n) => !n.read).length;
      if (unreadCount > 0) {
        setCountNotification((prevCount) => Math.max(prevCount - unreadCount, 0));
      }
      return prev.map((n) => ({ ...n, read: true }));
    });
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) setExpoPushToken(token);
      })
      .catch((err) => setError(err));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const title = notification?.request?.content?.title?.trim();
      if (!title) return;

      const newNotification = {
        message: title,
        read: false,
      };

      setNotifications((prev) => [...prev, newNotification]);
      setCountNotification((prevCount) => prevCount + 1);
    });

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
  }, []);

  const value = useMemo(() => ({
    notifications,
    countNotification,
    iconColor,
    expoPushToken,
    error,
    setPrimaryColor,
    setDefaultColor,
    restartCountNotification,
    markAsRead,
    markAllAsRead,
  }), [
    notifications,
    countNotification,
    iconColor,
    expoPushToken,
    error,
    markAsRead,
    markAllAsRead,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
