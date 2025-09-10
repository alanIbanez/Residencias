

import { useNotification } from "@/components/Layout/Notification/ContextNotification";
import { Text, View } from "react-native";
import { Screen } from "../../components/Layout/Screen";

export default function MainIndex() {
  const { expoPushToken } = useNotification();

   return (
     <Screen>
      <View>
        <Text>Pantalla Principal</Text>
        <Text>Expo Push Token: {expoPushToken}</Text>
      </View>
      
     </Screen>
    )
}