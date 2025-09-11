import * as Notifications from "expo-notifications";
import { Stack, useRouter, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as TaskManager from "expo-task-manager";
import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { UserIcon } from "../components/Layout/Icons";
import { NotificationProvider } from "../components/Layout/Notification/ContextNotification";
import NotificationIconComponent from "./Notification/NotificationIconComponent";
import { initializeLocalStoragePolyfill, loadStorageCache } from "../services/localStoragePolyfill";
import { initData, getCurrentUser } from "../services/salidasStorage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize storage and check for current user
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize localStorage polyfill
        initializeLocalStoragePolyfill();
        await loadStorageCache();
        
        // Initialize data
        await initData();
        
        // Check for current user
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        // Redirect to role selection if no user is selected
        if (!user && pathname !== '/role/select') {
          router.replace('/role/select');
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  // Function to get header title based on current screen and user
  const getHeaderTitle = () => {
    // For specific screens, show their titles
    if (pathname.includes('/Salida/') && pathname !== '/Salida/FormSalida') {
      return "Detalle de salida";
    }
    if (pathname === '/Salida/FormSalida') {
      return "Nueva salida";
    }
    if (pathname === '/role/select') {
      return "Seleccionar rol";
    }
    
    // For main/tab screens, show welcome message with user name
    if (currentUser) {
      return `Bienvenido ${currentUser.nombre}`;
    }
    
    // Fallback
    return "Residencias";
  };

  if (!isInitialized) {
    return null; // Or a loading screen
  }

  return (
    <NotificationProvider>
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerTitle: () => (
              <Text style={{ fontSize: 18, fontWeight: '600' }}>
                {getHeaderTitle()}
              </Text>
            ),
            headerLeft: () => <UserIcon />,
            headerRight: () => <NotificationIconComponent />
          }}
        />
      </View>
    </NotificationProvider>
  );
}
