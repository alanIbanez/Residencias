
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Screen } from '../../components/Layout/Screen';

export default function MessageNotification() {
  const { message, index } = useLocalSearchParams();

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerRight: () => {},
        }}
      />
      <View>
        <Text style={{ fontSize: 24 }}>{index}</Text>
        <Text style={{ fontSize: 24 }}>{message}</Text>
      </View>
    </Screen>
  );
}