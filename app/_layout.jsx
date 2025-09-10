import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as TaskManager from "expo-task-manager";
import { View } from "react-native";
import { UserIcon } from "../components/Layout/Icons";
import { NotificationProvider } from "../components/Layout/Notification/ContextNotification";
import NotificationIconComponent from "./Notification/NotificationIconComponent";

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
  return (
    <NotificationProvider>
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerTitle: "",
            headerLeft: () => <UserIcon />,
            headerRight: () => <NotificationIconComponent />
          }}
        />
      </View>
    </NotificationProvider>
  );
}
